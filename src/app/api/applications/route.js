import dbConnect from '@/lib/db';
import Application from '@/models/Application';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || 'All';

        const query = {};

        if (status !== 'All') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { company: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (page - 1) * limit;

        const [applications, total] = await Promise.all([
            Application.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Application.countDocuments(query),
        ]);

        return NextResponse.json({
            applications,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                current: page,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const application = await Application.create(body);
        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
