import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld';

export default defineComponent({
  name: 'App',
  setup() {
    const test = (msg: string): void => console.log(msg);
    return () => <HelloWorld msg="initialxy" onClick={test}/>;
  }
});