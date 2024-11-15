-- Create the 'blogs' table
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,          -- Auto-incrementing unique ID
    author VARCHAR(255),            -- Author's name
    url VARCHAR(255) NOT NULL,      -- URL of the blog, cannot be empty
    title VARCHAR(255) NOT NULL,    -- Title of the blog, cannot be empty
    likes INTEGER DEFAULT 0         -- Number of likes, defaults to 0
);

-- Insert data into the 'blogs' table
INSERT INTO blogs (author, url, title, likes)
VALUES
    ('John Doe', 'https://example.com/blog1', 'Introduction to SQL', 10),
    ('Jane Smith', 'https://example.com/blog2', 'Understanding Databases', 25);
