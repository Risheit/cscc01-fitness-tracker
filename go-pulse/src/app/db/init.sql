CREATE TABLE IF NOT EXISTS note (
    id SERIAL PRIMARY KEY,
    content VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS exercises (
    name VARCHAR(255) PRIMARY KEY,
    youtube_url VARCHAR(255) NOT NULL
);

INSERT INTO exercises (name, youtube_url) VALUES
('Bench Press', 'gMgvBspQ9lk'),
('Squat', 'i7J5h7BJ07g'),
('Pull Up', 'iWpoegdfgtc'),
('Deadlift', 'AweC3UaM14o');


-- Workouts Table (User-created & Pre-Built)
CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- NULL for pre-built workouts
    name VARCHAR(255) NOT NULL, -- "Full Body Routine", "Push-Pull-Legs", etc.
    is_prebuilt BOOLEAN DEFAULT FALSE, -- TRUE for pre-built workouts
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workout Days Table (Defines which days a workout occurs)
CREATE TABLE IF NOT EXISTS workout_days (
    id SERIAL PRIMARY KEY,
    workout_id INT REFERENCES workouts(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN 
        ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'))
);

-- Workout-Exercises Table (Links workouts to exercises & specific days)
CREATE TABLE IF NOT EXISTS workout_exercises (
    workout_id INT REFERENCES workouts(id) ON DELETE CASCADE,
    workout_day_id INT REFERENCES workout_days(id) ON DELETE CASCADE, -- Now exercises are assigned to days!
    name VARCHAR(255) NOT NULL, -- Example: "Squat", "Bench Press", etc.
    exercise_type VARCHAR(50) NOT NULL,
    sets INT DEFAULT NULL,
    reps INT DEFAULT NULL,
    mins INT DEFAULT NULL,
    weight DECIMAL(5,2) DEFAULT NULL, -- Optional
    description TEXT,
    position INT NOT NULL,
    PRIMARY KEY (workout_id, workout_day_id, position), -- Composite primary key to ensure unique position for each exercise on a given day
    CONSTRAINT position_order CHECK (position > 0), -- Ensuring position is a positive number
    CONSTRAINT valid_exercise CHECK (
        (exercise_type = 'Timed' AND mins IS NOT NULL AND sets IS NULL AND reps IS NULL AND weight IS NULL) OR
        (exercise_type = 'Sets' AND sets IS NOT NULL AND reps IS NOT NULL)
    ) -- Ensures logical values: Timed uses mins, Sets uses sets/reps
);

