import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });

        if (!response.ok) {
            // If fetch fails (403/404), we can't extract, but we shouldn't crash.
            // Just return empty data or error.
            return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 400 });
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Basic extraction heuristics
        const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || '';
        const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
        const siteName = $('meta[property="og:site_name"]').attr('content') || '';

        // Attempt to guess Role and Company from Title (often "Role at Company" or "Role | Company")
        let role = '';
        let company = siteName;

        // Common separators: " at ", " | ", " - ", " – "
        const separators = [' at ', ' | ', ' - ', ' – '];
        for (const sep of separators) {
            if (title.includes(sep)) {
                const parts = title.split(sep);
                // Heuristic: Usually "Role at Company"
                role = parts[0].trim();
                // If company wasn't found in site_name, use the second part
                if (!company || company.toLowerCase() === 'linkedin') {
                    // On LinkedIn, title is often "Role | Company | LinkedIn" or similar
                    // But actually "Post Name | LinkedIn" is common for feed. Job posts are "Role at Company" often.
                    if (parts.length > 1) company = parts[1].trim();
                }
                break;
            }
        }

        if (!role) role = title; // Fallback

        // Detect Work Mode
        let workMode = 'On-site'; // Default

        // Check title/desc first
        let textToCheck = (title + ' ' + description).toLowerCase();

        // If not found, check standard LD+JSON or body text (truncated)
        if (!textToCheck.includes('remote') && !textToCheck.includes('hybrid')) {
            const bodyText = $('body').text().replace(/\s+/g, ' ').slice(0, 3000).toLowerCase();
            textToCheck += ' ' + bodyText;
        }

        if (textToCheck.includes('remote') || textToCheck.includes('work from home') || textToCheck.includes('wfh') || textToCheck.includes('telecommute')) {
            workMode = 'Remote';
        } else if (textToCheck.includes('hybrid')) {
            workMode = 'Hybrid';
        }

        const data = {
            company,
            role,
            description,
            workMode,
            // We can also try to find location etc, but it's harder without specific selectors
        };
        return NextResponse.json(data);
    } catch (error) {
        console.error('Extraction error:', error);
        return NextResponse.json({ error: 'Extraction failed' }, { status: 500 });
    }
}
