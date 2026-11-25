# Brunk

A mobile fitness application built with React Native and Expo. The app allows users to track their workouts, monitor their strength progression, record daily steps and view fitness statistics over time.

## Features

### Workout Tracking
- Create and manage workouts.
- Record exercises, sets and weights.
- Store workout sessions for future reference.
- Track progress across previous workouts.

### Strength Statistics
- Calculate average strength progression for individual exercises.
- Compare recent workout performance.
- Display percentage increases and decreases in strength.
- View detailed progress for individual exercises.

### Step Tracking
- Track daily steps using the device pedometer.
- Set a personal daily step goal.
- View monthly and yearly step averages.
- Display step statistics over the last six months.

### Personalisation & Settings
- Switch between kilograms and pounds.
- Text-to-speech functionality for workout statistics.
- Customisable daily step goals.
- Option to delete stored user data.

## Technologies Used

- **React Native** – Mobile application development.
- **Expo** – Development and application tooling.
- **TypeScript** – Type safety and code organisation.
- **Expo Router** – Application navigation.
- **AsyncStorage** – Local data persistence.
- **React Native Gifted Charts** – Displaying fitness statistics.
- **Expo Pedometer** – Tracking daily steps.
- **Expo Speech** – Text-to-speech functionality.

## Installation

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   ```

2. Navigate into the project folder:

   ```bash
   cd YOUR_PROJECT_FOLDER
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the Expo development server:

   ```bash
   npx expo start
   ```

5. Open the application using Expo Go or an appropriate development build.

## Data Storage

The application uses AsyncStorage to save workout sessions, exercise data, step history and user preferences locally on the device.

This allows users to retain their data between app sessions without requiring an online account or external database.

## Future Improvements

- Improve strength progression calculations using weight and repetitions.
- Add additional workout statistics and visualisations.
- Improve the overall user interface and accessibility.
- Introduce workout reminders and goal tracking.
- Explore cloud backup and data synchronisation.

## Author

Developed as a personal software development
