import { createClient } from '@supabase/supabase-js';
import { SupabaseEvent, EventData, Facilitator } from '../types';

const SUPABASE_URL = 'https://vlrbeemaxxdqiczdxomd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZscmJlZW1heHhkcWljemR4b21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NzkxNDYsImV4cCI6MjA4NDE1NTE0Nn0.TVPeCb9pudVV2_OsjSeNU6fGCVOVxSx6mYUfZPg0QB0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const defaultAvatar = "https://ui-avatars.com/api/?background=random&name=";

export const fetchEvents = async (): Promise<EventData[]> => {
    const { data, error } = await supabase
        .from('events')
        .select(`
            id, title, start_time, end_time, 
            lat, lng, category, subcategory, 
            location_type, format, link, 
            city, country, continent, image_url,
            organizer, co_facilitators, status,
            profiles(full_name, avatar_url, is_blocked)
        `)
        .eq('is_hidden', false)
        .eq('status', 'live')
        .order('start_time', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    const rawData = data as any[];

    // 1. Collect all Co-Facilitator IDs
    const coFacilitatorIds = new Set<string>();
    rawData.forEach(item => {
        if (Array.isArray(item.co_facilitators)) {
            item.co_facilitators.forEach((cf: any) => {
                if (cf.id) coFacilitatorIds.add(cf.id);
            });
        }
    });

    // 2. Fetch profiles for these IDs to verify registration
    let validRegisteredIds = new Set<string>();
    if (coFacilitatorIds.size > 0) {
        const { data: profileData } = await supabase
            .from('profiles')
            .select('id, is_blocked')
            .in('id', Array.from(coFacilitatorIds));
        
        if (profileData) {
            profileData.forEach((p: any) => {
                if (!p.is_blocked) validRegisteredIds.add(p.id);
            });
        }
    }

    // 3. Map events
    return rawData.filter(item => {
        if (item.profiles && item.profiles.is_blocked) return false;
        return true;
    }).map((item: SupabaseEvent) => {
        let mainFacName = "Unknown";
        let mainFacAvatar = "";

        if (item.profiles) {
            mainFacName = item.profiles.full_name || "Unknown";
            mainFacAvatar = item.profiles.avatar_url || "";
        } else if (item.organizer) {
            mainFacName = item.organizer;
            mainFacAvatar = defaultAvatar + mainFacName;
        }

        const coFacilitators: Facilitator[] = [];
        if (item.co_facilitators && Array.isArray(item.co_facilitators)) {
            item.co_facilitators.forEach((cf: any) => {
                const name = cf.name;
                const avatar = cf.avatar || (defaultAvatar + name);
                const isRegistered = cf.id ? validRegisteredIds.has(cf.id) : false;
                coFacilitators.push({ name, avatar, id: cf.id, isRegistered });
            });
        }

        return {
            id: item.id,
            title: item.title,
            start: new Date(item.start_time),
            end: new Date(item.end_time),
            lat: item.lat,
            lng: item.lng,
            category: item.category || 'General',
            subcategory: item.subcategory || 'General',
            locationType: item.location_type,
            format: item.format,
            link: item.link,
            city: item.city || '',
            country: item.country || '',
            continent: item.continent || '',
            imageUrl: item.image_url,
            organizer: mainFacName,
            organizerAvatar: mainFacAvatar,
            organizerIsRegistered: !!item.profiles,
            coFacilitators,
            description: undefined // Lazy load
        };
    });
};

export const fetchEventDescription = async (id: number): Promise<string> => {
    const { data, error } = await supabase
        .from('events')
        .select('description')
        .eq('id', id)
        .single();

    if (error || !data) return "No description available.";
    return data.description;
};
