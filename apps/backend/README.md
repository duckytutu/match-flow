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
- **Guest**: Can view public information without authentication

## Public Routes (No Authentication Required)

The following routes are accessible without authentication:

### Tournaments
- `GET /tournaments` - Get all approved tournaments (Public)
- `GET /tournaments/:id` - Get tournament by ID (Public)

### Tournament Events
- `GET /tournament-events/tournament/:tournamentId` - Get events by tournament (Public)
- `GET /tournament-events/:id` - Get tournament event by ID (Public)

### Matches
- `GET /matches` - Get all matches (Public)
- `GET /matches/:id` - Get match by ID (Public)

### Scores
- `GET /scores` - Get all scores (Public)
- `GET /scores/:id` - Get score by ID (Public)

## Protected Routes (Authentication Required)

The following routes require authentication and specific roles:

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `POST /auth/logout` - Logout user (requires auth)
- `GET /auth/me` - Get current user info (requires auth)

### Users
- `GET /users` - Get all users (Admin, Organizer)
- `GET /users/:id` - Get user by ID (Admin, Organizer)
- `POST /users` - Create user (Admin)
- `PATCH /users/:id` - Update user (Admin)
- `DELETE /users/:id` - Delete user (Admin)
- `PATCH /users/:id/approve` - Approve user (Admin)

### Tournaments (Protected Operations)
- `POST /tournaments` - Create tournament (Organizer, Admin)
- `PATCH /tournaments/:id` - Update tournament (Organizer, Admin)
- `DELETE /tournaments/:id` - Delete tournament (Organizer, Admin)
- `GET /tournaments/pending` - Get tournaments pending approval (Admin)
- `PATCH /tournaments/:id/approve` - Approve tournament (Admin)
- `PATCH /tournaments/:id/reject` - Reject tournament (Admin)
- `PATCH /tournaments/:id/request-info` - Request more info (Admin)
- `GET /tournaments/organizer/:organizerId` - Get tournaments by organizer (Organizer, Admin)

### Tournament Events (Protected Operations)
- `POST /tournament-events` - Create tournament event (Organizer, Admin)
- `PATCH /tournament-events/:id` - Update tournament event (Organizer, Admin)
- `DELETE /tournament-events/:id` - Delete tournament event (Organizer, Admin)

### Event Registrations
- `POST /event-registrations` - Register for event (Athlete, Guest)
- `GET /event-registrations/event/:eventId` - Get registrations by event (Admin, Organizer)
- `GET /event-registrations/user/:userId` - Get registrations by user (Admin, Organizer)
- `GET /event-registrations/:id` - Get registration by ID (Admin, Organizer)
- `PATCH /event-registrations/:id` - Update registration (Admin, Organizer)
- `DELETE /event-registrations/:id` - Delete registration (Admin, Organizer)

### Matches (Protected Operations)
- `POST /matches` - Create match (Organizer, Admin)
- `PATCH /matches/:id` - Update match (Referee, Organizer, Admin)
- `PATCH /matches/:id/assign-referee` - Assign referee to match (Organizer, Admin)
- `PATCH /matches/:id/status` - Update match status (Referee, Organizer, Admin)
- `DELETE /matches/:id` - Delete match (Organizer, Admin)
- `GET /matches/tournament/:tournamentId` - Get matches by tournament (Public)
- `GET /matches/referee/:refereeId` - Get matches by referee (Referee, Organizer, Admin)

### Scores (Protected Operations)
- `POST /scores` - Create score (Referee, Organizer, Admin)
- `PATCH /scores/:id` - Update score (Referee, Organizer, Admin)
- `DELETE /scores/:id` - Delete score (Referee, Organizer, Admin)
- `GET /scores/match/:matchId` - Get scores by match (Public)

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
