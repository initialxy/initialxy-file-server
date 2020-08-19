import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: { type: String, required: true },
    onClick: Function as PropType<(msg: string) => void>,
  },
  setup(props) {
    const test = (_: Event): boolean => {
      props.onClick && props.onClick('clicked');
      return true;
    }
    return () => (
      <div onClick={test} >Hello World: {props.msg}</div>
    );
  }
});