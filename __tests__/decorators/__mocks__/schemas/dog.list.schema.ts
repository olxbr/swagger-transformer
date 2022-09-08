export const dogListSchema = {
  name: 'breed',
  schema: {
    enum: ['Caramelo', 'Labrador'],
  },
  description: 'Filter dogs by Breed',
  explode: true,
};
