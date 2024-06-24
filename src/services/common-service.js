import axios from 'axios';


class BackService {
  constructor() {
    this.apiUrlDependent = 'http://localhost:8000/dependent/';
    this.apiUrlUser = 'http://localhost:8000/user/';
    this.registerDependent = 'register-dependent';
    this.registerUser = 'register-user';
    this.allInfo = 'all-info';
  }

  async getAllInfo(id) {
    try {
      const response = await axios.get(this.apiUrlUser+this.allInfo+`/${id}`);
      return response;

    } catch (error) {
      return error.response

    }
  }

  async getUser(email, encoded_password) {
    const queryParams = new URLSearchParams({ email, encoded_password }).toString();
    try {
      const response = await axios.get(this.apiUrlUser+`info?${queryParams}`);
      return response;

    } catch (error) {
      return error.response

    }
  }

  async getDependent(cpf) {
    try {
      const response = await axios.get(this.apiUrlDependent+cpf);
      return response.data;

    } catch (error) {

        switch (error.response?.status) {
            case 404:
              console.error('User not found:', error);
              return null
            default:
              console.error('Error:', error);
              break;
          }

    }
  }

  async insertUser(data) {
    try {
      const result = await axios.post(this.apiUrlUser+this.registerUser, data);
      console.log("result isert", result)
      return result

    } catch (error) {
        console.log(error.response?.status)
        return error.response;

    }
  }

  async insertDependent(data) {
    try {
      const result = await axios.post(this.apiUrlDependent+this.registerDependent, data);
      console.log("result isert", result)
      return result

    } catch (error) {
        console.log(error.response?.status)
        return error.response;

    }
  }

  async updateDependent(cpf, data) {
    try {
      const result = await axios.put(this.apiUrlDependent+cpf, data);
      return result
      

    } catch (error) {
        console.log(error.response?.status)
        return error.response;
        

    }
  }

  async updateUser(cpf, data) {
    try {
      const result = await axios.put(this.apiUrlUser+cpf, data);
      return result
      

    } catch (error) {
        console.log(error.response?.status)
        return error.response;
        

    }
  }


}

export default BackService;