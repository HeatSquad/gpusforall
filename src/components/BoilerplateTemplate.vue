<template>
    <div>
        <!-- 
            <ExampleComponent :somePropParam="Hello"/>
            <div>{{somePropName}}</div>
            <ExampleComponent @eventName="someMethod"/>

            <button @click="onButtonClick">Button</button>
            <select @input="onSelectedInput"></select>

            <div :style="{background-color: color}"></div>
            <div :class="[someExpression ? 'a' : 'b', 'someClass']"></div>

            <div v-for="element in arrayElements" :key="someIdentifier">
                <span>{{element.key}}</span>
            </div>

            <div v-if="someExpression"></div>
            <div v-else-if="someExpression"></div>
            <div v-else>Catch-all</div>
            <div v-show="someExpression">Conditional, still rendered</div>

        -->
    </div>
</template>

<!-- Logic: State, Data, Methods, Lifecycle Methods -->
<script>
// import ExampleComponent from './components/ExampleComponent.vue'

export default {
    name: 'BoilerplateTemplate',
    components: {
        // ExampleComponent
    },
    props: {
        exampleProp: String,
        examplePropWithDefault: {
            type: String,
            default: 'This is the default title'
        },
        examplePropArray: Array,
    },
    data() {
        return {
            someArray: [],
            someString: '',
            someOtherString: '',
            someNumber: 10,
            someObject: { key: 'key', value: 'value' }
        }
    },
    /**
     * For complex logic that includes reactive data.
     * If we are doing a calculation (and it's computationally expensive), we want to use a computed property.
     * If we are performing a calculation and including it in the template more than once, we want to use a computed property.
     * If the data we are dealing with is an array, or is nested somehow, might want to consider using a computed property.
     * 
     * Computed properties can be data-binded in templates like a normal property.
     * Computed properties by default getter-only
     * 
     * Methods vs Computed Props:
     * Computed props are cached based on their reactive dependencies. Will only re-eval when some of its reactive dependencies have changed. A method invocation will always run the function when a re-render happens.
     * 
     * NOTE: Vue doesn't detect a change in a nested json's value (2+ levels deep)
     * Don't make async requests or mutate the DOM inside a computed getter: Getters should be side-effect free. Avoid mutating computed value.
     * 
     */
    computed: {
        doSomeCalculation() {
            let hyperintelligentSum = 0;
            hyperintelligentSum += 1;
            return hyperintelligentSum;
        },
        someComputedProperty: {
            get() {
                return this.someString + ' ' + this.someOtherString;
            },
            set(newValue) {
                [this.someString, this.someOtherString] = newValue.split(' ');
            }
        }
    },
    /**
     * To trigger a function whenever a reactive property changes. Want to use when for example, mutating the DOM, or changing state based on result of an async operation.
     * 
     * The watch option also supports a dot-delimited path as the key.
     * watch is shallow by default: the callback will only trigger when the watched property has been assigned a new value - it won't trigger on nested property changes. If you want the callback to fire on all nested mutations, you need to use a deep watcher.
     * 
     * watch is lazy by default: the callback won't be called until the watched source has changed.
     * We can force a watcher's callback to be executed immediately by declaring it using an object with a handler function and the immediate: true option
     * 
     * By default, user-created watcher callbacks are called before Vue component updates. if you attempt to access the DOM inside a watcher callback, the DOM will be in the state before Vue has applied any updates. If you want to access the DOM in a watcher callback after Vue has updated it, you need to specify the flush: 'post' option:
     * 
     */
    watch: {
        // This will run when someString changes
        someString(newString, oldString) {
            if (newString == 'yeah') this.someMethodThatUpdatesData();
        },
        'some.nested.key'(newValue) {
            // only simple paths, expressions not supported
        },
        someObject: {
            handler(newValue, oldValue) {
                // Note: `newValue` will be equal to `oldValue` here on nested mutations as long as the object itself hasn't been replaced.
            },
            deep: true,
            immediate: true,
            flush: 'post'
        }
    },
    emits: ['eventName'],
    // ====================================================
    // Lifecycle Methods
    // ====================================================
    beforeCreate() {
        console.log('Ran before created is called.');
    },
    created() {
        // Use this to access what's under data
        console.log('Component is created. Template has not yet compiled. After created, check if there is a pre-compiled template, compile if there isn\'t one');
        this.someNumber = 11;
    },
    beforeMount() {
        console.log('Ran before mounted is called. Template has compiled.');
    },
    mounted() {
        console.log('Component is mounted. Ran after the component has finished initial rendering and created the DOM nodes.');
    },
    beforeUpdate() {
        console.log('Ran before updated is called. A change in data was noticed.');
    },
    updated() {
        console.log('Component is updated. Re-render the DOM and patch.');
    },
    beforeUnmount() {
        console.log('Ran before unmounted is called. Component is about to be unmounted.');
    },
    unmounted() {
        console.log('Component is unmounted.');
    },
    // ====================================================
    // Methods
    // ====================================================
    methods: {
        someMethod() {
            console.log('You executed some method');
        },
        someMethodThatUpdatesData() {
            console.log('You executed some method that will updated data');
            this.someOtherString = 'I have been changed';
        },
        onButtonClick() {
            console.log('You clicked the button');
            const jsonSomeData = { key: 'Hello', value: 'World' };
            this.$emit('eventName', jsonSomeData);
        },
    }
}
</script>

<style scoped lang="scss">

</style>
