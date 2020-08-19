import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld';

export default defineComponent({
  name: 'App',
  setup() {
    return () => <HelloWorld msg="initialxy" />;
  }
});