// Vercel Serverless Function para Google Gemini API
// Este archivo debe estar en la carpeta /api/ de tu proyecto Vercel

export default async function handler(req, res) {
    // Solo permitir métodos POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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

        // Línea corregida en gemini.js
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
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
            case 'analysis':
                prompt = `Analiza los siguientes datos de inventario y proporciona insights detallados:
                
${message}

Proporciona:
1. Resumen ejecutivo
2. Patrones identificados
3. Recomendaciones específicas
4. Alertas importantes

Formato tu respuesta de manera clara y estructurada.`;
                break;
            case 'report':
                prompt = `Genera un reporte profesional basado en estos datos:
                
${message}

El reporte debe ser:
- Profesional y bien estructurado
- Incluir métricas clave
- Proporcionar conclusiones y recomendaciones
- Ser fácil de entender

Formato: Título, Resumen Ejecutivo, Métricas Principales, Análisis Detallado, Conclusiones y Recomendaciones.`;
                break;
        }

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
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
