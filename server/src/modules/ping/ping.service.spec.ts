import { Test, TestingModule } from '@nestjs/testing';
import { PingService } from './ping.service';

describe('PingService', () => {
  let service: PingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PingService],
    }).compile();

    service = module.get<PingService>(PingService);
  });

  it('should return "PONG 🏓"', () => {
    expect(service.getPingResponse()).toBe('Pong 🏓');
  });
});
