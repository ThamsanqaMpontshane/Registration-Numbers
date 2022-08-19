import assert from 'assert';
import registration from '../registration.js';
import pgPromise from 'pg-promise';

const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/my_registration2';

const config = {
    connectionString
}

if(process.env.NODE_ENV == "production"){
    config.ssl = {
        rejectUnauthorized: false
    }
}

const db = pgp(config);
const theRegies = registration(db);

describe('REGISTRATON', async () => {

    beforeEach(async () => {
        await db.manyOrNone('DELETE FROM reg_numbers where id > 0');
        });    
        it('should not allow duplicates', async () => {
            await theRegies.setRegNumber('CA123');
            await theRegies.setRegNumber('CY234');
            await theRegies.setRegNumber('CY345');
            await theRegies.setRegNumber('CA123');
            const regNumbers = await theRegies.getRegNumber();
            assert.deepEqual(regNumbers, ['CA123', 'CY234', 'CY345']);
        }),
        it('should return the reg number if it is valid', async () => {
            const regNumber = await theRegies.setRegNumber('CA123');
            assert.equal(regNumber, 'CA123');
        }),
        it('should return the reg number if it is valid', async () => {
            const regNumber = await theRegies.setRegNumber('CY234');
            assert.equal(regNumber, 'CY234');
        }),
        it('should return all reg numbers', async () => {
            await theRegies.setRegNumber('CA123');
            await theRegies.setRegNumber('CY234');
            const regNumbers = await theRegies.getRegNumber();
            assert.deepEqual(regNumbers, ['CA123', 'CY234']);
        }),
        it('should return all reg numbers', async () => {
            await theRegies.setRegNumber('CA123');
            await theRegies.setRegNumber('CY234');
            await theRegies.setRegNumber('CY345');
            const regNumbers = await theRegies.getRegNumber();
            assert.deepEqual(regNumbers, ['CA123', 'CY234', 'CY345']);
        }),
        it('should return all reg numbers by city', async () => {
            await theRegies.setRegNumber('CA123');
            await theRegies.setRegNumber('CY234');
            await theRegies.setRegNumber('CY345');
            const regNumbers = await theRegies.getRegNumberByCity('CA');
            assert.deepEqual(regNumbers, ['CA123']);
        }),
        it('should return all reg numbers by city', async () => {
            await theRegies.setRegNumber('CA123');
            await theRegies.setRegNumber('CY234');
            await theRegies.setRegNumber('CY345');
            const regNumbers = await theRegies.getRegNumberByCity('CY');
            assert.deepEqual(regNumbers, ['CY234', 'CY345']);
        }),
        it('should return all reg numbers by city', async () => {
            // CL
            await theRegies.setRegNumber('CA123');
            await theRegies.setRegNumber('CL234');
            await theRegies.setRegNumber('CY345');
            const regNumbers = await theRegies.getRegNumberByCity('CL');
            assert.deepEqual(regNumbers, ['CL234']);
        }),
        it('should reset the reg numbers', async () => {
            await theRegies.setRegNumber('CA123');
            await theRegies.setRegNumber('CY234');
            await theRegies.setRegNumber('CY345');
            await theRegies.reset();
            const regNumbers = await theRegies.getRegNumber();
            assert.deepEqual(regNumbers, []);
        })
    afterEach(async () => {
        await db.manyOrNone('Truncate reg_numbers');
    })
});