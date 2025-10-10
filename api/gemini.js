// Vercel Serverless Function para Google Gemini API
// Este archivo debe estar en la carpeta /api/ de tu proyecto Vercel

export default async function handler(req, res) {
    // Solo permitir métodos POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verificar si se solicita streaming
    const isStreaming = req.body.stream === true;

    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Obtener API Key desde variables de entorno
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            console.error('GEMINI_API_KEY not found in environment variables');
            console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('GEMINI')));
            return res.status(200).json({ 
                error: 'API Key not configured. Please add GEMINI_API_KEY to Vercel environment variables.',
                success: false,
                message: 'Para habilitar las funciones de IA, configura la variable GEMINI_API_KEY en Vercel.',
                debug: 'Variable GEMINI_API_KEY no encontrada en las variables de entorno'
            });
        }

        // Configurar la petición a Gemini - Usando gemini-2.5-flash-exp para mejor velocidad
        const endpoint = isStreaming ? 'streamGenerateContent' : 'generateContent';
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-exp:${endpoint}?key=${apiKey}`;
        
        console.log('Gemini URL:', geminiUrl.replace(apiKey, '***API_KEY***'));
        console.log('Context:', context);
        console.log('Message length:', message.length);
        
        let prompt = message;
        
        // Personalizar prompt según el contexto
        switch (context) {
            case 'validation':
                prompt = 'Responde con "OK" si puedes procesar este mensaje.';
                break;
            case 'chat':
                // El prompt ya viene formateado desde el frontend
                break;
            case 'search':
                prompt = `Eres un asistente de búsqueda de inventario especializado. 

INSTRUCCIONES:
- Analiza la consulta del usuario de manera semántica
- Busca artículos que coincidan con el concepto o intención
- Considera sinónimos, categorías relacionadas, y contexto
- Para consultas como "poco stock", "bajo stock", "necesito comprar" → busca items con stock <= minStock
- Para consultas como "herramientas", "materiales", "equipos" → busca por categorías relacionadas
- Para consultas como "prestado", "préstamo" → considera items en activeLoans
- Para consultas como "nuevo", "reciente" → considera items creados recientemente

${message}

RESPUESTA REQUERIDA:
Devuelve SOLO un JSON válido con esta estructura exacta:
{
  "items": [
    {"id": "item_id_1", "relevance": 0.95, "reason": "Explicación de por qué coincide"},
    {"id": "item_id_2", "relevance": 0.85, "reason": "Explicación de por qué coincide"}
  ],
  "summary": "Resumen de lo que se encontró",
  "suggestions": ["Sugerencia de búsqueda 1", "Sugerencia de búsqueda 2"]
}

Ordena los resultados por relevancia (mayor a menor). Máximo 20 resultados.`;
                break;
            case 'analysis':
                prompt = `Analiza inventario:

${message}

Proporciona:
1. Resumen
2. Patrones
3. Recomendaciones
4. Alertas

Formato claro.`;
                break;
            case 'report':
                prompt = `Reporte profesional:

${message}

Incluir:
- Métricas clave
- Conclusiones
- Recomendaciones

Formato: Título, Resumen, Métricas, Análisis, Conclusiones.`;
                break;
            case 'formatName':
                prompt = `Formatea este nombre de artículo corrigiendo ortografía y aplicando Title Case apropiado:

${message}

Devuelve solo el nombre corregido.`;
                break;
        }

        // Configuración optimizada para velocidad y eficiencia
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: context === 'validation' ? 0.1 : 0.7,
                topK: 20,
                topP: 0.8,
                maxOutputTokens: context === 'validation' ? 10 : (context === 'chat' ? 512 : 1024),
                candidateCount: 1
            }
        };

        // Hacer petición a Gemini
        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        // Manejar streaming si está habilitado
        if (isStreaming && response.ok) {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Transfer-Encoding', 'chunked');
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                                    const text = data.candidates[0].content.parts[0].text;
                                    if (text) {
                                        res.write(`data: ${JSON.stringify({ text, done: false })}\n\n`);
                                    }
                                }
                            } catch (e) {
                                // Ignorar líneas malformadas
                            }
                        }
                    }
                }
                
                res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
                res.end();
                return;
            } catch (error) {
                console.error('Streaming error:', error);
                res.write(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`);
                res.end();
                return;
            }
        }

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Gemini API error:', response.status, errorData);
            
            if (response.status === 400) {
                return res.status(400).json({ 
                    error: 'Invalid request to Gemini API',
                    success: false 
                });
            } else if (response.status === 403) {
                return res.status(403).json({ 
                    error: 'API Key invalid or quota exceeded',
                    success: false 
                });
            } else {
                return res.status(500).json({ 
                    error: 'Gemini API error',
                    success: false,
                    details: `Status: ${response.status}, Error: ${errorData}`,
                    debug: process.env.NODE_ENV === 'development' ? errorData : undefined
                });
            }
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Invalid response from Gemini:', data);
            return res.status(500).json({ 
                error: 'Invalid response from Gemini API',
                success: false 
            });
        }

        const generatedText = data.candidates[0].content.parts[0].text;
        
        // Para validación, solo necesitamos saber si funcionó
        if (context === 'validation') {
            return res.status(200).json({ 
                success: true,
                response: 'OK'
            });
        }

        return res.status(200).json({ 
            success: true,
            response: generatedText
        });

    } catch (error) {
        console.error('Error in Gemini API handler:', error);
        console.error('Error stack:', error.stack);
        
        return res.status(500).json({ 
            error: 'Internal server error',
            success: false,
            details: process.env.NODE_ENV === 'development' ? error.message : 'Check server logs for details',
            debug: {
                message: error.message,
                type: error.constructor.name
            }
        });
    }
}
