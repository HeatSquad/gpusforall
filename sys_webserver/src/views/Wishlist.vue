<template>
    <b-container style="border: 1px dashed red">
        <b-row class="justify-content-end py-2 mb-4">
            <b-button class="mx-2 px-4">Shopping Cart</b-button>
        </b-row>
        <b-row class="justify-content-space-evenly">
            <b-card-group deck>
                <!-- <div>
                    <div class="col-md-2"  v-for="(post, img) in posts" v-bind="post.id">
                        <div class="article-image">
                            <img :src="post.img" />
                        </div>
                    </div>

                    <div class="col-md-6" v-for="(post, title) in posts" v-bind="post.id">
                        <div class="article">
                            <div class="card">
                                <div class="card-body">
                                    <h3 class="card-title">{{ post.title }}</h3>
                                    <h6 class="card-subtitle text-muted">21st Dec 17</h6>
                                    <p class="card-text">{{ post.content }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> -->
            </b-card-group>
        </b-row>
    </b-container>
</template>

<script>
import { listOfStates } from '../util/constants';

export default {
    name: 'Wishlist',
    components: {
        // ExampleComponent
    },
    props: {
    },
    data() {
        return {
            productName: '',
            userName: '',
            listOfStates: [],
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
        if (!listOfStates || listOfStates.length == 0) return console.error('ERROR: Failed to retrieve list of states');
        const finalListOfStates = [];
        finalListOfStates.push({ value: null, text: ''});
        finalListOfStates.push(...listOfStates.map((state) =>
        {
            return { value: state, text: state };
        }));
        this.listOfStates = finalListOfStates;
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
.user-wishlist-container {
    padding: 24px 48px;
}
</style>