CREATE TABLE IF NOT EXISTS note (
    id SERIAL PRIMARY KEY,
    content VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
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


-- Workouts Table (User-created & Pre-Built)
CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- NULL for pre-built workouts
    name VARCHAR(255) NOT NULL, -- "Full Body Routine", "Push-Pull-Legs", etc.
    is_prebuilt BOOLEAN DEFAULT FALSE, -- TRUE for pre-built workouts
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workout Days Table (Defines which days a workout occurs)
CREATE TABLE workout_days (
    id SERIAL PRIMARY KEY,
    workout_id INT REFERENCES workouts(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN 
        ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'))
);

-- Workout-Exercises Table (Links workouts to exercises & specific days)
CREATE TABLE workout_exercises (
    id SERIAL PRIMARY KEY,
    workout_id INT REFERENCES workouts(id) ON DELETE CASCADE,
    workout_day_id INT REFERENCES workout_days(id) ON DELETE CASCADE, -- Now exercises are assigned to days!
    name VARCHAR(255) NOT NULL, -- Example: "Squat", "Bench Press", etc.
    sets INT NOT NULL,
    reps INT NOT NULL,
    weight DECIMAL(5,2) DEFAULT NULL, -- Optional
    rest_time INT DEFAULT 60
);

