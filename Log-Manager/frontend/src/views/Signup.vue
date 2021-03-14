<template>
  <div>
    <b-form @submit.prevent="signUp" class="w-50 ml-auto mr-auto mt-5">
      <b-form-group
        id="input-group-1"
        label="아이디(이메일)"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          required
          placeholder="이메일을 입력하세요"
          @blur="duplicatedEmail"
          @focus="modifyEmail"
        ></b-form-input>
      </b-form-group>

      <div style="margin-bottom:20px">
        <span v-bind:class="form.checkColor">{{form.check}}</span>
      </div>

      <b-form-group id="input-group-2" label="이름" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.name"
          required
          placeholder="이름을 입력하세요."
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="비밀번호" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.password"
          type="password"
          required
          placeholder="비밀번호를 입력하세요."
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="비밀번호 확인" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="form.confirmPassword"
          type="password"
          required
          placeholder="동일한 비밀번호를 입력하세요."
        ></b-form-input>
      </b-form-group>

      <div>
        <span 
          v-if="form.password === form.confirmPassword && form.confirmPassword"
          style="color:blue"
        >
          비밀번호가 일치합니다
        </span>
        <span
          v-else-if="form.confirmPassword"
          style="color:red"
          >
          비밀번호가 일치하지 않습니다.
        </span>
      </div>

      <div class="mt-5 d-flex justify-content-center">
        <b-button type="submit" variant="primary">회원가입</b-button>
        <b-button type="reset" variant="danger" class="ml-3">초기화</b-button>
      </div>
    </b-form>
  </div>
</template>
<style>
  .color-blue {
    color : blue;
  }
  .color-red {
    color : red;
  }
</style>

<script>
  import axios from "axios";

  export default {
    data() {
      return {
        form: {
          email: "",
          password: "",
          confirmPassword: "",
          name: "",
          check: "",
          checkColor: "",
        },
      };
    },
    methods: {
      async signUp(e) {
        const {email, password, name, confirmPassword} = this.form;
        if(email && password && name && password === confirmPassword) {
          try{
            const {data} = await axios.post("http://localhost:8000/api/user", {
              email, password, name
            });
            console.log(data);
            if(data.signup) {
              alert("회원가입이 완료되었습니다.");
              this.$router.push("/login");
            }
            else {
              alert("이메일 중복체크를 해주세요.");
            }
          } catch(error) {
            console.log(error);
          }
        } else {
          alert("아이디 및 비밀번호, 이름을 확인해주세요");
        }
      },
      async duplicatedEmail() {
        const {email} = this.form;
          if (email) {
            const {data} = await axios.post("http://localhost:8000/api/check", {email});
            console.log(data.check);
            if(data.check) {
              this.form.check = "사용가능한 이메일입니다.";
              this.form.checkColor = "color-blue";
            }
            else {
              this.form.check = "중복된 이메일입니다.";
              this.form.checkColor = "color-red";
            }
          }
          else {
            this.form.check = "이메일을 입력하세요."
            this.form.checkColor = "color-red";
          }
      },
      modifyEmail() {
        if (this.form.check ==="중복된 이메일입니다.") this.form.email = "";
        this.form.check = "";
      },
    },
  };
</script>