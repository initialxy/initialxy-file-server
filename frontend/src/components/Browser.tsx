import { defineComponent, PropType } from "vue";
import { Item } from "../jsgen/Item"

export default defineComponent({
  name: 'Browser',
  props: {
    items: { type: Array as PropType<Item[]>, required: true },
  },
  setup(props) {
    return () => (
      <div class="Browser">
        {Array.from(props.items).map(i => <div>{i.name}</div>)}
      </div>
    );
  }
});