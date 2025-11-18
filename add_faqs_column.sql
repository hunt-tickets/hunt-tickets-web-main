-- Add faqs column to events table
-- This column will store FAQs as JSONB array

ALTER TABLE events
ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;

-- Add a comment to describe the column
COMMENT ON COLUMN events.faqs IS 'Frequently Asked Questions stored as JSONB array of {id, question, answer} objects';

-- Create an index for faster JSONB queries (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_events_faqs ON events USING gin (faqs);
