import { expect, test } from 'vitest';
import { User } from '../../model/User';
import { Gender } from '../../model/Gender';

test('should have the correct properties', () => {
    const user: User = {
        username: 'john_doe',
        email: 'john@example.com',
        firstname: 'John',
        lastname: 'Doe',
        password: 'password123',
        gender: Gender.Male,
        interestedCategory: ['Breakfast', 'Dessert']
    };

    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('firstname');
    expect(user).toHaveProperty('lastname');
    expect(user).toHaveProperty('password');
    expect(user).toHaveProperty('gender');
    expect(user).toHaveProperty('interestedCategory');
});

test('should have optional _id property of type string or ObjectId', () => {
    const user: User = {
        _id: '6093aefc22e963001f2ef47d',
        username: 'jane_doe',
        email: 'jane@example.com',
        firstname: 'Jane',
        lastname: 'Doe',
        password: 'password456',
        gender: Gender.FEMALE
    };

    expect(user).toHaveProperty('_id', '6093aefc22e963001f2ef47d');
});
