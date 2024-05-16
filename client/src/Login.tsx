function login() {
    return (
      <div>
          <div>
              <label>Username</label>
              <input id='username' type='text'></input>
          </div>
  
          <div>
              <label>Password</label>
              <input id='password' type='text'></input>
          </div>
  
          <div>
              <button type='submit' >Submit</button>
          </div>
      </div>
    )
  }
  
  export default login