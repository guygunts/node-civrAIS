const supertest = require('supertest')
const app = require('../../routes')


describe('Post Endpoints', () => {
  it('should create a new post', async () => {
    const res = await supertest(app).post('/geniespeech/login')
      .send({
        user_name: "superadmin",
        password: "1234",
        lang:"th",
        authen_type:"1"
      })
       console.log(res)
    expect(res.code).toEqual(200)
    expect(res.body).toHaveProperty('post')
  })
})