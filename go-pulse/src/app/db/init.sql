CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE exercises (
    name VARCHAR(255) PRIMARY KEY,
    description TEXT,
    video_id VARCHAR(255) NOT NULL,
    image_path VARCHAR(255) NOT NULL
);

CREATE TABLE workout_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE workout (
    plan INTEGER REFERENCES workout_plans(id),
    position INTEGER,
    exercise VARCHAR(255) REFERENCES exercises(name),
    workout_type VARCHAR(50) NOT NULL,
    mins INTEGER,
    sets INTEGER,
    reps INTEGER,
    PRIMARY KEY (plan, position)
);

INSERT INTO exercises (name, description, video_id, image_path) VALUES
('Bench Press', 'Always warm up before starting and maintain proper form by keeping your posture upright and landing softly on your feet to reduce impact. Stay aware of your surroundings by running in well-lit areas, wearing reflective gear if it''s dark, and listening at a volume that allows you to hear traffic and other hazards.', 'gMgvBspQ9lk', '/weight.jpg'),
('Squats', 'Always warm up before starting and maintain proper form by keeping your posture upright and landing softly on your feet to reduce impact. Stay aware of your surroundings by running in well-lit areas, wearing reflective gear if it''s dark, and listening at a volume that allows you to hear traffic and other hazards.', 'i7J5h7BJ07g', '/weight.jpg'),
('Pull Up', 'Always warm up before starting and maintain proper form by keeping your posture upright and landing softly on your feet to reduce impact. Stay aware of your surroundings by running in well-lit areas, wearing reflective gear if it''s dark, and listening at a volume that allows you to hear traffic and other hazards.', 'iWpoegdfgtc', '/weight.jpg'),
('Deadlift', 'Always warm up before starting and maintain proper form by keeping your posture upright and landing softly on your feet to reduce impact. Stay aware of your surroundings by running in well-lit areas, wearing reflective gear if it''s dark, and listening at a volume that allows you to hear traffic and other hazards.', 'AweC3UaM14o', '/weight.jpg');

INSERT INTO workout_plans (name) VALUES
('Easy Workout');

-- Easy workout steps
INSERT INTO workout (plan, position, exercise, workout_type, sets, reps) VALUES
(1, 1, 'Bench Press', 'Sets', 2, 2),
(1, 3, 'Pull Up', 'Sets', 2, 5);

INSERT INTO workout (plan, position, exercise, workout_type, mins) VALUES
(1, 2, 'Squats', 'Timed', 3),
(1, 4, 'Squats', 'Timed', 2);