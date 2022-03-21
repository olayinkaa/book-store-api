const request = require("supertest")
const app = require("../../app.js")
const { faker } = require('@faker-js/faker');

const genderOption = ["male","female"]
const RIndex = Math.floor(Math.random() * 2) // random number between 0 and 1

const userDetails = {
    firstName: faker.name.firstName(),
    lastName:faker.name.lastName(),
    email:faker.internet.email(),
    gender:genderOption[RIndex],
    password:"password",
    contactInfo:{
        address:faker.address.streetAddress(),
        phoneNumber: faker.phone.phoneNumber()
    }
}

describe("", () =>{

    beforeEach(() => {
        jest.useFakeTimers()
        jest.setTimeout(100000)
    })

    // test("POST user/register", async () =>{
    //     const res = await request(app)
    //                 .post('/api/v1/user/register')
    //                 .send(userDetails)
    //     expect(res.status).toEqual(200);
    // })

    // test("GET user/register", async()=>{
    //     const res = await request(app)
    //                 .get('/api/v1/user/register')
    //     expect(res.status).toEqual(200);
    // })   
    
    test("POST user/login", async()=>{
        const res = await request(app)
                    .post('/api/v1/user/login')
                    .send({
                        email:"ibrahimolayinkaa@gmail.com",
                        password:"password"
                    })
        expect(res.status).toEqual(200);
    })    
})
