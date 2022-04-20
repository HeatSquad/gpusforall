<template>
    <b-container fluid>
        This is the user bitch
        <b-row>
            <b-button>Orders</b-button>
            <b-button>Transactions</b-button>
            <b-button>Wishlist</b-button>
        </b-row>
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
    </b-container>
</template>

<!-- Logic: State, Data, Methods, Lifecycle Methods -->
<script>
// import ExampleComponent from './components/ExampleComponent.vue'

export default {
    name: 'User',
    components: {
        // ExampleComponent
    },
    props: {
    },
    data() {
        return {
        }
    },

    // ====================================================
    // Lifecycle Methods
    // ====================================================
    created() {
        console.log('Component is created. Template has not yet compiled. After created, check if there is a pre-compiled template, compile if there isn\'t one');
    },
    mounted() {
        console.log('Component is mounted. Ran after the component has finished initial rendering and created the DOM nodes.');
    },
    updated() {
        console.log('Component is updated. Re-render the DOM and patch.');
    },

    // ====================================================
    // Methods
    // ====================================================
    methods: {
    }
}
</script>

<style scoped lang="scss">
</style>
