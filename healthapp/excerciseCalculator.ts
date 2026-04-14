interface ExerciseValues {
  dailyExercises: number[];
  target: number;
}

interface Result {
  trainingDays: number;
  periodLength: number;
  success: boolean;
  target: number;
  average: number;
  rating: number;
  ratingDescription: string;
}

const parseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const dailyExercises: number[] = [];

  for (let i = 3; i < args.length; i++) {
    const value = Number(args[i]);
    if (isNaN(value)) {
      throw new Error('Provided values were not numbers!');
    }
    dailyExercises.push(value);
  }

  const target = Number(args[2]);
  if (isNaN(target)) {
    throw new Error('Provided values were not numbers!');
  }

  return {
    dailyExercises,
    target,
  };
};

export const calculateExercises = ( dailyExercises: number[], target: number): Result => {
  console.log(`dailyExercises: ${dailyExercises}, target: ${target}`);

  if (dailyExercises.length === 0) {
    throw new Error('No exercise values provided');
  }

  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter(hours => hours > 0).length;
  const totalHours = dailyExercises.reduce((sum, hours) => sum + hours, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (success) {
    rating = 3;
    ratingDescription = 'excellent';
  } else if (average >= target * 0.7) {
    rating = 2;
    ratingDescription = 'fine';
  } else {
    rating = 1;
    ratingDescription = 'bad';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  const { dailyExercises, target } = parseArguments(process.argv);
  console.log(calculateExercises(dailyExercises, target));
} catch (error) {
  console.log('Error:', error.message);
}