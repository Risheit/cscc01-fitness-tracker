CREATE TABLE IF NOT EXISTS note (
    id SERIAL PRIMARY KEY,
    content VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user1_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user1_id, user2_id) -- Prevent duplicate conversations
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    youtube_url VARCHAR(255) NOT NULL
);

INSERT INTO exercises (name, youtube_url) VALUES
('Bench Press', 'gMgvBspQ9lk'),
('Squat', 'i7J5h7BJ07g'),
('Pull Up', 'iWpoegdfgtc'),
('Deadlift', 'AweC3UaM14o');
