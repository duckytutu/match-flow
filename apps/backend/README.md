# Pickleball Tournament Management Backend

A NestJS backend for managing pickleball tournaments with role-based access control.

## Features

- **User Management**: Registration, authentication, and role-based access control
- **Tournament Management**: Create, update, and manage tournaments
- **Registration System**: Athletes and guests can register for tournaments
- **Match Management**: Schedule and manage tournament matches
- **Score Tracking**: Referees can update match scores
- **Admin Dashboard**: System statistics and user management

## User Roles

- **Admin**: Full system access, can approve organizers and tournaments
- **Organizer**: Can create and manage tournaments, assign referees
- **Referee**: Can update match scores and manage assigned matches
- **Athlete**: Can register for tournaments and view results
- **Guest**: Can register for tournaments and view public information

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Users
- `GET /users` - Get all users (Admin, Organizer)
- `GET /users/:id` - Get user by ID (Admin, Organizer)
- `POST /users` - Create user (Admin)
- `PATCH /users/:id` - Update user (Admin)
- `DELETE /users/:id` - Delete user (Admin)

### Tournaments
- `GET /tournaments` - Get all tournaments (Public)
- `GET /tournaments/:id` - Get tournament by ID (Public)
- `POST /tournaments` - Create tournament (Organizer, Admin)
  - Sample request:
    ```json
    {
      "name": "Spring Open",
      "description": "Annual spring pickleball tournament",
      "location": "City Sports Center",
      "startDate": "2025-04-01",
      "status": "draft",
      "isApproved": false,
      "organizerId": 2,
      "events": [
        {
          "type": "singles_male",
          "maxTeams": 16,
          "entryFee": 20.0,
          "groupStagePoints": 11,
          "groupStageWinBy": 2,
          "groupStageMaxPoints": 15,
          "groupStageBo": 1,
          "knockoutStagePoints": 11,
          "knockoutStageWinBy": 2,
          "knockoutStageMaxPoints": 15,
          "knockoutStageBo": 3
        }
      ]
    }
    ```
  - Sample response:
    ```json
    {
      "id": 1,
      "name": "Spring Open",
      "description": "Annual spring pickleball tournament",
      "location": "City Sports Center",
      "startDate": "2025-04-01T00:00:00.000Z",
      "status": "draft",
      "isApproved": false,
      "organizerId": 2,
      "events": [
        {
          "id": 1,
          "type": "singles_male",
          "maxTeams": 16,
          "entryFee": 20.0,
          "groupStagePoints": 11,
          "groupStageWinBy": 2,
          "groupStageMaxPoints": 15,
          "groupStageBo": 1,
          "knockoutStagePoints": 11,
          "knockoutStageWinBy": 2,
          "knockoutStageMaxPoints": 15,
          "knockoutStageBo": 3
        }
      ],
      "createdAt": "2025-03-01T12:00:00.000Z",
      "updatedAt": "2025-03-01T12:00:00.000Z"
    }
    ```

### Tournament Events
- `POST /tournament-events` - Create tournament event
  - Sample request:
    ```json
    {
      "tournamentId": 1,
      "type": "doubles_male",
      "maxTeams": 16,
      "entryFee": 30.0,
      "prizes": "Medals, Trophies",
      "groupStagePoints": 11,
      "groupStageWinBy": 2,
      "groupStageMaxPoints": 15,
      "groupStageBo": 1,
      "knockoutStagePoints": 11,
      "knockoutStageWinBy": 2,
      "knockoutStageMaxPoints": 15,
      "knockoutStageBo": 3
    }
    ```
  - Sample response:
    ```json
    {
      "id": 1,
      "tournamentId": 1,
      "type": "doubles_male",
      "maxTeams": 16,
      "entryFee": 30.0,
      "prizes": "Medals, Trophies",
      "groupStagePoints": 11,
      "groupStageWinBy": 2,
      "groupStageMaxPoints": 15,
      "groupStageBo": 1,
      "knockoutStagePoints": 11,
      "knockoutStageWinBy": 2,
      "knockoutStageMaxPoints": 15,
      "knockoutStageBo": 3,
      "createdAt": "2025-04-01T10:00:00.000Z",
      "updatedAt": "2025-04-01T10:00:00.000Z"
    }
    ```

### Event Registrations
- `POST /event-registrations` - Register for event
  - Sample request:
    ```json
    {
      "eventId": 1,
      "teamName": "Team Alpha",
      "notes": "Looking forward to the event!",
      "teamMembers": "[{\"name\":\"John Doe\",\"age\":25},{\"name\":\"Jane Smith\",\"age\":24}]"
    }
    ```
  - Sample response:
    ```json
    {
      "id": 1,
      "eventId": 1,
      "userId": 2,
      "status": "pending",
      "teamName": "Team Alpha",
      "notes": "Looking forward to the event!",
      "paidAmount": 0,
      "isPaid": false,
      "teamMembers": "[{\"name\":\"John Doe\",\"age\":25},{\"name\":\"Jane Smith\",\"age\":24}]",
      "createdAt": "2025-04-01T10:00:00.000Z",
      "updatedAt": "2025-04-01T10:00:00.000Z"
    }
    ```

### Matches
- `GET /matches` - Get all matches (Public)
- `GET /matches/:id` - Get match by ID (Public)
- `POST /matches` - Create match
  - Sample request:
    ```json
    {
      "eventId": 1,
      "matchNumber": 1,
      "type": "singles",
      "scheduledTime": "2025-04-01T10:00:00.000Z",
      "courtNumber": 2,
      "player1Name": "John Doe",
      "player2Name": "Jane Smith",
      "refereeId": 3
    }
    ```
  - Sample response:
    ```json
    {
      "id": 1,
      "eventId": 1,
      "matchNumber": 1,
      "type": "singles",
      "status": "scheduled",
      "scheduledTime": "2025-04-01T10:00:00.000Z",
      "courtNumber": 2,
      "player1Name": "John Doe",
      "player2Name": "Jane Smith",
      "refereeId": 3,
      "winner": null,
      "notes": null,
      "createdAt": "2025-04-01T10:00:00.000Z",
      "updatedAt": "2025-04-01T10:00:00.000Z"
    }
    ```

### Scores
- `GET /scores` - Get all scores (Public)
- `GET /scores/:id` - Get score by ID (Public)
- `POST /scores` - Create score
  - Sample request:
    ```json
    {
      "matchId": 1,
      "setNumber": 1,
      "team1Score": 11,
      "team2Score": 8,
      "notes": "Great set!"
    }
    ```
  - Sample response:
    ```json
    {
      "id": 1,
      "matchId": 1,
      "setNumber": 1,
      "team1Score": 11,
      "team2Score": 8,
      "notes": "Great set!",
      "createdAt": "2025-04-01T10:30:00.000Z",
      "updatedAt": "2025-04-01T10:30:00.000Z"
    }
    ```

### Admin
- `GET /admin/stats` - Get system statistics (Admin, Organizer)

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=pickleball

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Application Configuration
NODE_ENV=development
PORT=3000
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see above)

3. Start the development server:
```bash
npm run start:dev
```

## Testing

Run unit tests:
```bash
npm run test
```

Run e2e tests:
```bash
npm run test:e2e
```

## Database

The application uses PostgreSQL with TypeORM. The database schema is automatically generated based on the entity definitions.

## Docker

Build the Docker image:
```bash
docker build -t pickleball-backend .
```

Run with Docker Compose (see root directory for docker-compose.yml):
```bash
docker-compose up
```

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
