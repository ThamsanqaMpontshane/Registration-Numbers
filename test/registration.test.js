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
    describe('SET REG NUMBER' , async () => {
        it('should be able to set a registration number', async () => {
            const regNumber = await theRegies.setRegNumber('CA 123-123');
            assert.equal(regNumber, 'CA 123-123');
        });
        it('should not be able to set a registration number if it is not valid', async () => {
            const regNumber = await theRegies.setRegNumber('CA12345');
            const regex = /^((CA|CY|CL)\s([0-9]){3}(\-|\s)([0-9]){3})$/;
            assert.equal(regex.test(regNumber), false);
        });
        it('should not be able to set a registration number if it is not valid', async () => {
            const regNumber = await theRegies.setRegNumber('CA12345');
            const regex = /^((CA|CY|CL)\s([0-9]){3}(\-|\s)([0-9]){3})$/;
            assert.equal(regex.test(regNumber), false);
        });
    });
    describe('GET REG NUMBER', async () => {
        it('should be able to get all registration numbers', async () => {
            await theRegies.setRegNumber('CA 123-123');
            await theRegies.setRegNumber('CA 124 345');
            await theRegies.setRegNumber('CA 125-567');
            const regNumbers = await theRegies.getRegNumber();
            assert.deepEqual(regNumbers, ['CA 123-123', 'CA 124 345', 'CA 125-567']);
        });
    });  
    describe('DUPLICATE REJECTION', async () => {
        it('should not allow duplicates', async () => {
            await theRegies.setRegNumber('CA 123-123');
            await theRegies.setRegNumber('CA 125-567');
            await theRegies.setRegNumber('CA 124 345');
            await theRegies.setRegNumber('CA 123-123');
            const regNumbers = await theRegies.getRegNumber();
            assert.equal(regNumbers.length, 3);
        });
    });
    describe('COUNT', async () => {
        it('should return the count of reg numbers', async () => {
            await theRegies.setRegNumber('CA 124 345');
            await theRegies.setRegNumber('CA 123-123');
            const regNumbers = await theRegies.getRegNumber();
            assert.equal(regNumbers.length, 2);
        });
        it('should return the count of reg numbers', async () => {
            await theRegies.setRegNumber('CA 123-123');
            await theRegies.setRegNumber('CA 124 343');
            await theRegies.setRegNumber('CA 125-567');
            const regNumbers = await theRegies.getRegNumber();
            assert.equal(regNumbers.length, 3);
        });
    });
    describe('GET REGISTRATIONS BY CITY', async () => {
        it('should return all reg numbers from Cape Town', async () => {
            await theRegies.setRegNumber('CA 357-567');
            await theRegies.setRegNumber('CY 125-369');
            await theRegies.setRegNumber('CY 369-567');
            const regNumbers = await theRegies.getRegNumberByCity('CA');
            assert.equal(regNumbers.length, 1);
        });
        it('should return all reg numbers from Bellville', async () => {
            await theRegies.setRegNumber('CA 354-367');
            await theRegies.setRegNumber('CY 125-881');
            await theRegies.setRegNumber('CY 136-658');
            const regNumbers = await theRegies.getRegNumberByCity('CY');
            assert.equal(regNumbers.length, 2);
        });
        it('should return all reg numbers from Paarl', async () => {
            await theRegies.setRegNumber('CA 354-367');
            await theRegies.setRegNumber('CL 125-881');
            await theRegies.setRegNumber('CY 136-658');
            const regNumbers = await theRegies.getRegNumberByCity('CL');
            assert.equal(regNumbers.length, 1);
        });
    });
    describe('RESET', async () => {
        it('should reset the reg numbers', async () => {
            await theRegies.setRegNumber('CA 354-367');
            await theRegies.setRegNumber('CY 125-881');
            await theRegies.setRegNumber('CY 136-658');
            await theRegies.reset();
            const regNumbers = await theRegies.getRegNumber();
            assert.equal(regNumbers.length, 0);
        });
    });
    after(async () => {
        await db.manyOrNone('Truncate reg_numbers');
    })
});