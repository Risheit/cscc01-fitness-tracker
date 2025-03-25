CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT,
    weight_lbs INT,
    age INT,
    gender VARCHAR(2) CHECK (gender IN ('M', 'F')),
    bio TEXT
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

-- password is 'pass'
INSERT INTO users (username, password) VALUES
('user', '$2a$10$OnfmNxLKChtJtatMu9m9v.Khh0iIFW28xqoCdEp55SWKJPsHxI402');

CREATE TABLE exercises (
    name VARCHAR(255) PRIMARY KEY,
    description TEXT,
    video_id VARCHAR(255),
    image_path VARCHAR(255) NOT NULL
);

INSERT INTO exercises (name, description, video_id, image_path) VALUES
('Bench Press', 'Always warm up before starting and maintain proper form by keeping your posture upright and landing softly on your feet to reduce impact. Stay aware of your surroundings by running in well-lit areas, wearing reflective gear if it''s dark, and listening at a volume that allows you to hear traffic and other hazards.', 'gMgvBspQ9lk', '/weight.jpg'),
('Squats', 'Always warm up before starting and maintain proper form by keeping your posture upright and landing softly on your feet to reduce impact. Stay aware of your surroundings by running in well-lit areas, wearing reflective gear if it''s dark, and listening at a volume that allows you to hear traffic and other hazards.', 'i7J5h7BJ07g', '/weight.jpg'),
('Pull Up', 'Always warm up before starting and maintain proper form by keeping your posture upright and landing softly on your feet to reduce impact. Stay aware of your surroundings by running in well-lit areas, wearing reflective gear if it''s dark, and listening at a volume that allows you to hear traffic and other hazards.', 'iWpoegdfgtc', '/weight.jpg'),
('Deadlift', 'Always warm up before starting and maintain proper form by keeping your posture upright and landing softly on your feet to reduce impact. Stay aware of your surroundings by running in well-lit areas, wearing reflective gear if it''s dark, and listening at a volume that allows you to hear traffic and other hazards.', 'AweC3UaM14o', '/weight.jpg'),
('Jumping rope', null, 'kDOGb9C5kp0', '/stock-running.jpg');

-- Workouts Table (User-created & Pre-Built)
CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- NULL for pre-built workouts
    image_path VARCHAR(255),
    name VARCHAR(255) NOT NULL, -- "Full Body Routine", "Push-Pull-Legs", etc.
    is_prebuilt BOOLEAN DEFAULT FALSE, -- TRUE for pre-built workouts
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO workouts (user_id, name, image_path) VALUES
(1, 'Easy Workout', '/stock-running.jpg');

-- Workout Days Table (Defines which days a workout occurs)
CREATE TABLE IF NOT EXISTS workout_days (
    id SERIAL PRIMARY KEY,
    workout_id INT REFERENCES workouts(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN 
        ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'))
);

INSERT INTO workout_days (workout_id, day_of_week) VALUES
(1, 'Monday');

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

INSERT INTO workout_exercises(workout_id, workout_day_id, name, exercise_type, sets, reps, mins, description, position) VALUES
(1, 1, 'Bench Press', 'Sets', 2, 2, NULL, 'Always warm up before starting and maintain proper form by keeping your posture upright and landing softly on your feet to reduce impact. Stay aware of your surroundings by running in well-lit areas, wearing reflective gear if it''s dark, and listening at a volume that allows you to hear traffic and other hazards.', 1),
(1, 1, 'Pull Up', 'Sets', 2, 5, NULL, 'Always warm up before starting and maintain proper form by keeping your posture upright and landing softly on your feet to reduce impact. Stay aware of your surroundings by running in well-lit areas, wearing reflective gear if it''s dark, and listening at a volume that allows you to hear traffic and other hazards.', 3),
(1, 1, 'Squats', 'Timed', NULL, NULL, 3, 'Always warm up before starting and maintain proper form by keeping your posture upright and landing softly on your feet to reduce impact. Stay aware of your surroundings by running in well-lit areas, wearing reflective gear if it''s dark, and listening at a volume that allows you to hear traffic and other hazards.', 2),
(1, 1, 'Squats', 'Timed', NULL, NULL, 2, 'Always warm up before starting and maintain proper form by keeping your posture upright and landing softly on your feet to reduce impact. Stay aware of your surroundings by running in well-lit areas, wearing reflective gear if it''s dark, and listening at a volume that allows you to hear traffic and other hazards.', 4);
