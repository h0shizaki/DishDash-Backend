import jwt from 'jsonwebtoken';
import { expect, test } from 'vitest';
import { decoedToken, generateUserToken } from '../../utils/jwt';
import { User } from '../../model/User';
import { Gender } from '../../model/Gender';
import Config from '../../config';

const SECRET = new Config().getJwtSecret()

const user: User = {
    _id: '123', email: 'test@example.com', username: 'testuser',
    firstname: '',
    lastname: '',
    password: '',
    gender: Gender.FEMALE
};

test('should generate a valid JWT token', () => {
    const token = generateUserToken(user);
    const decoded = jwt.verify(token, SECRET);
    expect(decoded).toEqual(expect.objectContaining({ _id: user._id, email: user.email, username: user.username }));
});

test('should include an expiration time of 7 days', () => {
    const token = generateUserToken(user);
    const decoded: any = jwt.decode(token);
    const expiration = decoded?.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    const differenceInSeconds = expiration - currentTime;
    const sevenDaysInSeconds = 7 * 24 * 60 * 60;
    expect(differenceInSeconds).toBeCloseTo(sevenDaysInSeconds, -1); // Close enough to 7 days
});



test('should decode a valid JWT token', () => {
    const token = generateUserToken(user);
    const decoded = decoedToken(token);
    expect(decoded).toEqual(expect.objectContaining({ _id: user._id, email: user.email, username: user.username }));
});

test('should throw an error for an invalid JWT token', () => {
    const invalidToken = 'invalid_token';
    expect(() => decoedToken(invalidToken)).toThrow();
});


