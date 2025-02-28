import { getWorkoutPlan } from "../models/Workout";
import ExerciseScreen from "./components/ExerciseScreen";

export default async function WorkoutPage() {

  const data = await getWorkoutPlan(1);

  return (
    <ExerciseScreen exercises={data} />
  );
}
