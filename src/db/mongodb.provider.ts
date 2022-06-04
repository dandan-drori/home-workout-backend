import { MongoClient } from 'mongodb';
import { ConfigService } from '@nestjs/config';

export const mongoDbProvider = {
  provide: 'MONGODB_CONNECTION',
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) =>
    new Promise((resolve, reject) => {
      const connectionString = configService.get<string>('MONGO_CONNECTION');
      const db = configService.get<string>('MONGO_DB');
      MongoClient.connect(connectionString, (error, client) => {
        if (error) {
          reject(error);
        } else {
          resolve(client.db(db));
        }
      });
    }),
};
