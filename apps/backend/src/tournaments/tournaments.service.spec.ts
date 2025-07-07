import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TournamentsService } from './tournaments.service';
import { Tournament } from '../entities/tournament.entity';

describe('TournamentsService', () => {
  let service: TournamentsService;
  let repository: Repository<Tournament>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentsService,
        {
          provide: getRepositoryToken(Tournament),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TournamentsService>(TournamentsService);
    repository = module.get<Repository<Tournament>>(getRepositoryToken(Tournament));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tournament successfully', async () => {
      const tournamentData = {
        name: 'Test Tournament',
        description: 'A test tournament',
        location: 'Test Location',
        startDate: new Date(),
        endDate: new Date(),
        organizerId: 1,
      };

      const createdTournament = {
        id: 1,
        ...tournamentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(createdTournament);
      mockRepository.save.mockResolvedValue(createdTournament);

      const result = await service.create(tournamentData);

      expect(result).toEqual(createdTournament);
      expect(mockRepository.create).toHaveBeenCalledWith(tournamentData);
      expect(mockRepository.save).toHaveBeenCalledWith(createdTournament);
    });
  });

  describe('findAll', () => {
    it('should return all tournaments with organizer relations', async () => {
      const tournaments = [
        {
          id: 1,
          name: 'Tournament 1',
          organizer: { id: 1, firstName: 'John', lastName: 'Doe' },
        },
        {
          id: 2,
          name: 'Tournament 2',
          organizer: { id: 2, firstName: 'Jane', lastName: 'Smith' },
        },
      ];

      mockRepository.find.mockResolvedValue(tournaments);

      const result = await service.findAll();

      expect(result).toEqual(tournaments);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['organizer'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a tournament by id with relations', async () => {
      const tournament = {
        id: 1,
        name: 'Test Tournament',
        organizer: { id: 1, firstName: 'John', lastName: 'Doe' },
        registrations: [],
        matches: [],
      };

      mockRepository.findOne.mockResolvedValue(tournament);

      const result = await service.findOne(1);

      expect(result).toEqual(tournament);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['organizer', 'registrations', 'matches'],
      });
    });
  });

  describe('findByOrganizer', () => {
    it('should return tournaments by organizer id', async () => {
      const tournaments = [
        {
          id: 1,
          name: 'Tournament 1',
          organizerId: 1,
          organizer: { id: 1, firstName: 'John', lastName: 'Doe' },
          registrations: [],
        },
      ];

      mockRepository.find.mockResolvedValue(tournaments);

      const result = await service.findByOrganizer(1);

      expect(result).toEqual(tournaments);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { organizerId: 1 },
        relations: ['organizer', 'registrations'],
      });
    });
  });

  describe('update', () => {
    it('should update a tournament successfully', async () => {
      const updateData = { name: 'Updated Tournament' };
      const updateResult = { affected: 1 };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(1, updateData);

      expect(result).toEqual(updateResult);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe('remove', () => {
    it('should delete a tournament successfully', async () => {
      const deleteResult = { affected: 1 };

      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(1);

      expect(result).toEqual(deleteResult);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('updateParticipantCount', () => {
    it('should update participant count based on registrations', async () => {
      const tournament = {
        id: 1,
        name: 'Test Tournament',
        registrations: [
          { id: 1, userId: 1 },
          { id: 2, userId: 2 },
        ],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(tournament as any);
      jest.spyOn(service, 'update').mockResolvedValue({ affected: 1 } as any);

      await service.updateParticipantCount(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.update).toHaveBeenCalledWith(1, { currentParticipants: 2 });
    });

    it('should handle tournament with no registrations', async () => {
      const tournament = {
        id: 1,
        name: 'Test Tournament',
        registrations: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(tournament as any);
      jest.spyOn(service, 'update').mockResolvedValue({ affected: 1 } as any);

      await service.updateParticipantCount(1);

      expect(service.update).toHaveBeenCalledWith(1, { currentParticipants: 0 });
    });

    it('should handle tournament not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      jest.spyOn(service, 'update').mockResolvedValue({ affected: 0 } as any);

      await service.updateParticipantCount(999);

      expect(service.findOne).toHaveBeenCalledWith(999);
      expect(service.update).not.toHaveBeenCalled();
    });
  });
}); 