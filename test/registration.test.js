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
            const regNumber = await theRegies.setRegNumber('CA123');
            assert.equal(regNumber, 'CA123');
        });
        it('should not be able to set a registration number if it is not valid', async () => {
            const regNumber = await theRegies.setRegNumber('CA12345');
            const regex = /^[a-zA-Z]{2}\d{3}$/;
            assert.equal(regex.test(regNumber), false);
        });
        it('should not be able to set a registration number if it is not valid', async () => {
            const regNumber = await theRegies.setRegNumber('CA12345');
            const regex = /^[a-zA-Z]{2}\d{3}$/;
            assert.equal(regex.test(regNumber), false);
        });
    });
    describe('GET REG NUMBER', async () => {
        it('should be able to get all registration numbers', async () => {
            await theRegies.setRegNumber('CA123');
            await theRegies.setRegNumber('CA124');
            await theRegies.setRegNumber('CA125');
            const regNumbers = await theRegies.getRegNumber();
            assert.deepEqual(regNumbers, ['CA123', 'CA124', 'CA125']);
        });
    });  
    describe('DUPLICATE REJECTION', async () => {
        it('should not allow duplicates', async () => {
            await theRegies.setRegNumber('CA123');
            await theRegies.setRegNumber('CY234');
            await theRegies.setRegNumber('CY345');
            await theRegies.setRegNumber('CA123');
            const regNumbers = await theRegies.getRegNumber();
            assert.equal(regNumbers.length, 3);
        });
    });
    describe('COUNT', async () => {
        it('should return the count of reg numbers', async () => {
            await theRegies.setRegNumber('CA123');
            await theRegies.setRegNumber('CY234');
            const regNumbers = await theRegies.getRegNumber();
            assert.equal(regNumbers.length, 2);
        });
        it('should return the count of reg numbers', async () => {
            await theRegies.setRegNumber('CA123');
            await theRegies.setRegNumber('CY234');
            await theRegies.setRegNumber('CY345');
            const regNumbers = await theRegies.getRegNumber();
            assert.equal(regNumbers.length, 3);
        });
    });
    describe('GET REGISTRATIONS BY CITY', async () => {
        it('should return all reg numbers from Cape Town', async () => {
            await theRegies.setRegNumber('CA123');
            await theRegies.setRegNumber('CY234');
            await theRegies.setRegNumber('CY345');
            const regNumbers = await theRegies.getRegNumberByCity('CA');
            assert.equal(regNumbers.length, 1);
        });
        it('should return all reg numbers from Bellville', async () => {
            await theRegies.setRegNumber('CA123');
            await theRegies.setRegNumber('CY234');
            await theRegies.setRegNumber('CY345');
            const regNumbers = await theRegies.getRegNumberByCity('CY');
            assert.equal(regNumbers.length, 2);
        });
        it('should return all reg numbers from Paarl', async () => {
            // CL
            await theRegies.setRegNumber('CA123');
            await theRegies.setRegNumber('CL234');
            await theRegies.setRegNumber('CY345');
            const regNumbers = await theRegies.getRegNumberByCity('CL');
            assert.equal(regNumbers.length, 1);
        });
    });
    describe('RESET', async () => {
        it('should reset the reg numbers', async () => {
            await theRegies.setRegNumber('CA123');
            await theRegies.setRegNumber('CY234');
            await theRegies.setRegNumber('CY345');
            await theRegies.reset();
            const regNumbers = await theRegies.getRegNumber();
            assert.equal(regNumbers.length, 0);
        });
    });
    after(async () => {
        await db.manyOrNone('Truncate reg_numbers');
    })
});