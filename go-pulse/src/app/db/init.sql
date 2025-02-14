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
