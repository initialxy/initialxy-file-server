import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: { type: String, required: true },
  },
  setup(props) {
    return () => (
      <div>Hello World: {props.msg}</div>
    );
  }
});