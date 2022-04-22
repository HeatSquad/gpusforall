<template>
    <b-container fluid class="user-profile-management-container" style="border: 1px dashed red">
        <b-row class="justify-content-end py-2 mb-4">
            <b-button class="mx-2 px-4">Orders</b-button>
            <b-button class="mx-2 px-4">Transactions</b-button>
            <b-button class="mx-2 px-4">Wishlist</b-button>
        </b-row>
        <b-row class="justify-content-between">
            <b-col cols="8">
                <b-card>
                    <b-row>
                        <b-col cols="6">
                            <b-form-group id="inputGroupFirstName" label="First Name:" label-for="inputFirstName">
                                <b-form-input id="inputFirstName" v-model="firstName" placeholder="Enter first name" maxLength="100" required></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="6">
                            <b-form-group id="inputGroupFirstName" label="Last Name:" label-for="inputLastName">
                                <b-form-input id="inputLastName" v-model="lastName" placeholder="Enter last name" maxLength="100" required></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="6">
                            <b-form-group id="inputGroupEmail" label="Email:" label-for="inputEmail">
                                <b-form-input id="inputEmail" v-model="email" type="email" placeholder="Enter email" maxLength="320" required></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="6">
                            <b-form-group id="inputGroupPhone" label="Phone Number:" label-for="inputPhone">
                                <b-form-input id="inputPhone" v-model="phone" type="tel" placeholder="Enter phone number (no spaces)" maxLength="10" required></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="6">
                            <b-form-group id="inputGroupPassword" label="Password:" label-for="inputPassword">
                                <b-form-input id="inputPassword" v-model="password" type="password" maxLength="50" required></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="6">
                            <b-form-group id="inputGroupDob" label="Date of Birth:" label-for="inputDob">
                                <b-form-input id="inputDob" v-model="dob" type="date" required></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
            <b-col cols="2" align-self="center" >
                <b-card>
                <div class="user-profile-image-container" style="border: 1px dashed blue;">
                    <img src="/images/user-profile-placeholder.png" />
                </div>
                <b-row class="justify-content-center my-2">
                    <b-button variant="primary" class="px-5">Edit</b-button>
                </b-row>
                </b-card>
            </b-col>
        </b-row>
        <br>
        <b-row>
            <b-col cols="8">
                <b-card>
                    <h3>Shipping Address</h3>
                    <b-row>
                        <b-col cols="12">
                            <b-form-group id="inputGroupShippingStreet1" label="Street and number, p.o. box, c/o" label-for="inputShippingStreet1" class="w-100">
                                <b-form-input id="inputShippingStreet1" v-model="shippingAddress.street1" maxLength="100" required></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="12">
                            <b-form-group id="inputGroupShippingStreet2" label="Apartment, suite, building, unit, floor, etc." label-for="inputShippingStreet2" class="w-100">
                                <b-form-input id="inputShippingStreet2" v-model="shippingAddress.street2" maxLength="100" required></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="3">
                            <b-form-group id="inputGroupShippingCity" label="City" label-for="inputShippingCity" class="w-100">
                                <b-form-input id="inputShippingCity" v-model="shippingAddress.city" maxLength="100" required></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="3">
                            <b-form-group id="inputGroupShippingState" label="State" label-for="inputShippingState" class="w-100">
                                <b-form-select id="inputShippingState" v-model="shippingAddress.state" :options="listOfStates" required></b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col cols="3">
                            <b-form-group id="inputGroupShippingZipCode" label="Zip Code" label-for="inputShippingZipCode" class="w-100">
                                <b-form-input id="inputShippingZipCode" v-model="shippingAddress.zipCode" required maxLength="5"></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="3">
                            <b-form-group id="inputGroupShippingCountry" label="Country" label-for="inputShippingCountry" class="w-100">
                                <b-form-input id="inputShippingCountry" v-model="shippingAddress.country" required></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <br>

                    <h3>Billing Address</h3>
                    <b-row>
                        <b-col cols="12">
                            <b-form-group id="inputGroupBillingStreet1" label="Street and number, p.o. box, c/o" label-for="inputBillingStreet1" class="w-100">
                                <b-form-input id="inputBillingStreet1" v-model="billingAddress.street1" maxLength="100" required></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="12">
                            <b-form-group id="inputGroupBillingStreet2" label="Apartment, suite, building, unit, floor, etc." label-for="inputBillingStreet2" class="w-100">
                                <b-form-input id="inputBillingStreet2" v-model="billingAddress.street2" maxLength="100" required></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="3">
                            <b-form-group id="inputGroupBillingCity" label="City" label-for="inputBillingCity" class="w-100">
                                <b-form-input id="inputBillingCity" v-model="billingAddress.city" maxLength="100" required></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="3">
                            <b-form-group id="inputGroupBillingState" label="State" label-for="inputBillingState" class="w-100">
                                <b-form-select id="inputBillingState" v-model="billingAddress.state" :options="listOfStates" required></b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col cols="3">
                            <b-form-group id="inputGroupBillingZipCode" label="Zip Code" label-for="inputBillingZipCode" class="w-100">
                                <b-form-input id="inputBillingZipCode" v-model="billingAddress.zipCode" required maxLength="5"></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="3">
                            <b-form-group id="inputGroupBillingCountry" label="Country" label-for="inputBillingCountry" class="w-100">
                                <b-form-input id="inputBillingCountry" v-model="billingAddress.country" required></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <br>
                </b-card>
            </b-col>
        </b-row>
        <br>
        <b-row>
            <b-col cols="8">
                <b-card>
                    <h3>Payment Information</h3>
                    <br>
                    <b-row v-for="(cardObject, index) in paymentInfo.cards" :key="card+index" align-h="between" class="border-bottom mx-1 mb-3">
                        <b-col cols="4">
                            <div class="font-weight-bold text-black-75">{{cardObject.cardNetwork}} ending in {{cardObject.lastFourDigits}}</div>
                            <div class="text-muted">{{cardObject.expiration}}</div>
                        </b-col>
                        <b-col cols="6">
                            <b-badge v-if="cardObject.default" variant="secondary" class="px-4 py-2">Default</b-badge>
                        </b-col>
                        <b-col cols="auto">
                            <b-button class="px-4">Edit</b-button>
                        </b-col>
                    </b-row>
                    <b-row class="justify-content-end">
                        <b-button class="px-4 mx-4">Add Payment Method</b-button>
                    </b-row>
                </b-card>
            </b-col>
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
import { listOfStates } from '../util/constants';
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
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            dob: '',
            shippingAddress:
            {
                street1: '',
                street2: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
            },
            billingAddress:
            {
                street1: '',
                street2: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
            },
            paymentInfo:
            {
                cards:
                [
                    { cardNetwork: "Visa", lastFourDigits: 1234, expiration: "2028-11", default: true },
                    { cardNetwork: "Visa", lastFourDigits: 5678, expiration: "2028-08", default: false },
                    { cardNetwork: "MasterCard", lastFourDigits: 9119, expiration: "2023-02", default: false },
                ]
            },
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
.user-profile-management-container {
    padding: 24px 48px;
}
.user-profile-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    // width: 196px;
    // height: 196px;
    // border: 1px dashed brown;

    img {
        display: block;
        width: 100%;
        max-width: 240px;
        max-height: 240px;
        object-fit: contain;
        // width: 240px;
        // height: 240px;
        border-radius: 50%;
        border: 1px dashed brown;
    }
}
</style>
