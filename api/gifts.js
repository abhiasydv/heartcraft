const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Fail fast if env variables are missing
if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default async function handler(req, res) {
    // Enable CORS just in case
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Server misconfiguration: Missing database credentials.' });
    }

    if (req.method === 'POST') {
        // Create a new gift
        try {
            const { template_type, data } = req.body;
            
            if (!template_type || !data) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const { data: result, error } = await supabase
                .from('gifts')
                .insert([{ template_type, data }])
                .select();

            if (error) throw error;

            return res.status(200).json({ id: result[0].id });
        } catch (error) {
            console.error('Error creating gift:', error);
            return res.status(500).json({ error: 'Failed to save gift' });
        }
    } 
    else if (req.method === 'GET') {
        // Retrieve an existing gift
        try {
            const { id } = req.query;
            
            if (!id) {
                return res.status(400).json({ error: 'Missing gift ID' });
            }

            const { data: gift, error } = await supabase
                .from('gifts')
                .select('data, template_type')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (!gift) {
                return res.status(404).json({ error: 'Gift not found' });
            }

            return res.status(200).json(gift);
        } catch (error) {
            console.error('Error fetching gift:', error);
            return res.status(500).json({ error: 'Failed to retrieve gift' });
        }
    } 
    else {
        res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
