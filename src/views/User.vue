<template>
    <b-container fluid class="user-profile-management-container" style="border: 1px dashed red">
        <b-row class="justify-content-end py-2 mb-4">
            <b-button class="mx-2 px-4" @click="fetchCurrentUser">Orders</b-button>
            <b-button class="mx-2 px-4">Transactions</b-button>
            <b-button class="mx-2 px-4" to="/wishlist">Wishlist</b-button>
        </b-row>
        <b-row class="justify-content-between">
            <b-col cols="8">
                <b-card>
                    <b-row>
                        <b-col cols="6">
                            <b-row class="mx-1 justify-content-between align-items-baseline">
                                <label for="inputFullName">Name:</label>
                                <b-button size="sm" @click="openEditNameModal">
                                    <b-icon icon="pencil-fill"></b-icon>
                                </b-button>
                            </b-row>
                            <b-form-group id="inputGroupFullName">
                                <b-form-input id="inputFullName" v-model="fullName" maxLength="202" disabled></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="6">
                            <b-row class="mx-1 justify-content-between align-items-baseline">
                                <label for="inputEmail">Email:</label>
                                <b-button size="sm" @click="openEditEmailModal">
                                    <b-icon icon="pencil-fill"></b-icon>
                                </b-button>
                            </b-row>
                            <b-form-group id="inputGroupEmail">
                                <b-form-input id="inputEmail" v-model="email" type="email" placeholder="Enter email" maxLength="320" disabled></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="6">
                            <b-row class="mx-1 justify-content-between align-items-baseline">
                                <label for="inputPhone">Phone Number:</label>
                                <b-button size="sm" @click="openEditPhoneModal">
                                    <b-icon icon="pencil-fill"></b-icon>
                                </b-button>
                            </b-row>
                            <b-form-group id="inputGroupPhone">
                                <b-form-input id="inputPhone" v-model="phone" type="tel" placeholder="###-###-####" maxLength="10" disabled></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="6">
                            <b-row class="mx-1 justify-content-between align-items-baseline">
                                <label for="inputDob">Date of Birth:</label>
                                <b-button size="sm" @click="openEditDobModal">
                                    <b-icon icon="pencil-fill"></b-icon>
                                </b-button>
                            </b-row>
                            <b-form-group id="inputGroupDob">
                                <b-form-input id="inputDob" v-model="dob" type="date" disabled></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row class="justify-content-end" @click="openChangePasswordModal">
                        <b-button class="mx-3 px-4" variant="primary">Change Password</b-button>
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
                    <b-row class="mx-1 justify-content-end">
                        <b-button size="sm" @click="openEditShippingAddressModal">
                            <b-icon icon="pencil-fill"></b-icon>
                        </b-button>
                    </b-row>
                    <b-row>
                        <b-col cols="12">
                            <b-row class="mx-1">
                                <label for="inputShippingStreet1">Street and number, p.o. box, c/o</label>
                            </b-row>
                            <b-form-group id="inputGroupShippingStreet1" class="w-100">
                                <b-form-input id="inputShippingStreet1" v-model="shippingAddress.street1" maxLength="100" disabled></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="12">
                            <b-row class="mx-1">
                                <label for="inputShippingStreet2">Apartment, suite, building, unit, floor, etc.</label>
                            </b-row>
                            <b-form-group id="inputGroupShippingStreet2" class="w-100">
                                <b-form-input id="inputShippingStreet2" v-model="shippingAddress.street2" maxLength="100" disabled></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="3">
                            <b-row class="mx-1">
                                <label for="inputShippingCity">City</label>
                            </b-row>
                            <b-form-group id="inputGroupShippingCity" class="w-100">
                                <b-form-input id="inputShippingCity" v-model="shippingAddress.city" maxLength="100" disabled></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="3">
                            <b-row class="mx-1">
                                <label for="inputShippingState">State</label>
                            </b-row>
                            <b-form-group id="inputGroupShippingState" class="w-100">
                                <b-form-select id="inputShippingState" v-model="shippingAddress.state" :options="listOfStates" disabled></b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col cols="3">
                            <b-row class="mx-1">
                                <label for="inputShippingZipCode">Zip Code</label>
                            </b-row>
                            <b-form-group id="inputGroupShippingZipCode" class="w-100">
                                <b-form-input id="inputShippingZipCode" v-model="shippingAddress.zipCode" maxLength="5" disabled></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="3">
                            <b-row class="mx-1">
                                <label for="inputShippingCountry">Country</label>
                            </b-row>
                            <b-form-group id="inputGroupShippingCountry" class="w-100">
                                <b-form-input id="inputShippingCountry" v-model="shippingAddress.country" disabled></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <br>

                    <h3>Billing Address</h3>
                    <b-row class="mx-1 justify-content-end">
                        <b-button size="sm" @click="openEditBillingAddressModal">
                            <b-icon icon="pencil-fill"></b-icon>
                        </b-button>
                    </b-row>
                    <b-row>
                        <b-col cols="12">
                            <b-row class="mx-1">
                                <label for="inputBillingStreet1">Street and number, p.o. box, c/o</label>
                            </b-row>
                            <b-form-group id="inputGroupBillingStreet1" class="w-100">
                                <b-form-input id="inputBillingStreet1" v-model="billingAddress.street1" maxLength="100" disabled></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="12">
                            <b-row class="mx-1">
                                <label for="inputBillingStreet2">Apartment, suite, building, unit, floor, etc.</label>
                            </b-row>
                            <b-form-group id="inputGroupBillingStreet2" class="w-100">
                                <b-form-input id="inputBillingStreet2" v-model="billingAddress.street2" maxLength="100" disabled></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="3">
                            <b-row class="mx-1">
                                <label for="inputBillingCity">City</label>
                            </b-row>
                            <b-form-group id="inputGroupBillingCity" class="w-100">
                                <b-form-input id="inputBillingCity" v-model="billingAddress.city" maxLength="100" disabled></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="3">
                            <b-row class="mx-1">
                                <label for="inputBillingState">State</label>
                            </b-row>
                            <b-form-group id="inputGroupBillingState" class="w-100">
                                <b-form-select id="inputBillingState" v-model="billingAddress.state" :options="listOfStates" disabled></b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col cols="3">
                            <b-row class="mx-1">
                                <label for="inputBillingZipCode">Zip Code</label>
                            </b-row>
                            <b-form-group id="inputGroupBillingZipCode" class="w-100">
                                <b-form-input id="inputBillingZipCode" v-model="billingAddress.zipCode" disabled maxLength="5"></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="3">
                            <b-row class="mx-1">
                                <label for="inputBillingCountry">Country</label>
                            </b-row>
                            <b-form-group id="inputGroupBillingCountry" class="w-100">
                                <b-form-input id="inputBillingCountry" v-model="billingAddress.country" disabled></b-form-input>
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
                    <b-row v-for="(cardObject, index) in cards" :key="'card_'+index" align-h="between" class="border-bottom mx-1 mb-3">
                        <b-col cols="4">
                            <div class="font-weight-bold text-black-75">{{cardObject.network}} ending in {{cardObject.last_four_digits}}</div>
                            <div class="text-muted">{{cardObject.expiration_date}}</div>
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
        <!-- Modals -->
        <b-modal id="editNameModal" title="Edit Name" size="lg" @ok="saveCurrentUserFullName" @cancel="closeEditNameModal">
            <b-row>
                <b-col cols="5">
                    <b-form-group id="inputGroupFirstNameEdit" label="First Name:" label-for="inputFirstNameEdit">
                        <b-form-input id="inputFirstNameEdit" v-model="firstNameEdit" placeholder="Enter first name" maxLength="100" :state="validation['firstNameEdit']" aria-describedby="inputFirstNameEditFeedback"></b-form-input>
                        <b-form-invalid-feedback id="inputFirstNameEditFeedback">{{this.errorFeedback['firstNameEdit']}}</b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
                <b-col cols="5">
                    <b-form-group id="inputGroupLastNameEdit" label="Last Name:" label-for="inputLastNameEdit">
                        <b-form-input id="inputLastNameEdit" v-model="lastNameEdit" placeholder="Enter last name" maxLength="100"
                        :state="validation['lastNameEdit']" aria-describedby="inputLastNameEditFeedback"></b-form-input>
                        <b-form-invalid-feedback id="inputLastNameEditFeedback">{{this.errorFeedback['lastNameEdit']}}</b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-modal>
        <b-modal id="editEmailModal" title="Edit Email" size="lg" @cancel="closeEditEmailModal">
            <b-form-group id="inputGroupEmailEdit" label="Email:" label-for="inputEmailEdit">
                <b-form-input id="inputEmailEdit" v-model="emailEdit" type="email" placeholder="Enter email" maxLength="320"></b-form-input>
            </b-form-group>
        </b-modal>
        <b-modal id="editPhoneModal" title="Edit Phone Number" size="lg" @cancel="closeEditPhoneModal">
            <b-form-group id="inputGroupPhoneEdit" label="Phone:" label-for="inputPhoneEdit">
                <b-form-input id="inputPhoneEdit" v-model="phoneEdit" type="tel" placeholder="###-###-####" maxLength="10"></b-form-input>
            </b-form-group>
        </b-modal>
        <b-modal id="editDobModal" title="Edit Date of Birth" size="lg" @cancel="closeEditDobModal">
            <b-form-group id="inputGroupDobEdit" label="Date of Birth:" label-for="inputDobEdit">
                <b-form-input id="inputDobEdit" v-model="dobEdit" type="date"></b-form-input>
            </b-form-group>
        </b-modal>
        <b-modal id="changePasswordModal" title="Change Password" size="lg" @cancel="closeChangePasswordModal">
            <b-form-group id="inputGroupPasswordCurrent" label="Current Password:" label-for="inputPasswordCurrent">
                <b-form-input id="inputPasswordCurrent" v-model="passwordCurrent" placeholder="Enter current password" maxLength="100"></b-form-input>
            </b-form-group>
            <b-form-group id="inputGroupPasswordNew" label="New Password:" label-for="inputPasswordNew">
                <b-form-input id="inputPasswordNew" v-model="passwordNew" placeholder="New password" maxLength="100"></b-form-input>
            </b-form-group>
            <b-form-group id="inputGroupPasswordConfirm" label="Confirm New Password:" label-for="inputPasswordConfirm">
                <b-form-input id="inputPasswordConfirm" v-model="passwordConfirm" placeholder="Confirm new password" maxLength="100"></b-form-input>
            </b-form-group>
        </b-modal>
        <b-modal id="editShippingAddressModal" title="Edit Shipping Address" size="lg" @cancel="closeEditShippingAddressModal">
            <b-row>
                <b-col cols="12">
                    <b-row class="mx-1">
                        <label for="inputShippingStreet1Edit">Street and number, p.o. box, c/o</label>
                    </b-row>
                    <b-form-group id="inputGroupShippingStreet1" class="w-100">
                        <b-form-input id="inputShippingStreet1Edit" v-model="shippingAddressEdit.street1" maxLength="100"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12">
                    <b-row class="mx-1">
                        <label for="inputShippingStreet2Edit">Apartment, suite, building, unit, floor, etc.</label>
                    </b-row>
                    <b-form-group id="inputGroupShippingStreet2" class="w-100">
                        <b-form-input id="inputShippingStreet2Edit" v-model="shippingAddressEdit.street2" maxLength="100"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="3">
                    <b-row class="mx-1">
                        <label for="inputShippingCityEdit">City</label>
                    </b-row>
                    <b-form-group id="inputGroupShippingCity" class="w-100">
                        <b-form-input id="inputShippingCityEdit" v-model="shippingAddressEdit.city" maxLength="100"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
                    <b-row class="mx-1">
                        <label for="inputShippingStateEdit">State</label>
                    </b-row>
                    <b-form-group id="inputGroupShippingState" class="w-100">
                        <b-form-select id="inputShippingStateEdit" v-model="shippingAddressEdit.state" :options="listOfStates"></b-form-select>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
                    <b-row class="mx-1">
                        <label for="inputShippingZipCodeEdit">Zip Code</label>
                    </b-row>
                    <b-form-group id="inputGroupShippingZipCode" class="w-100">
                        <b-form-input id="inputShippingZipCodeEdit" v-model="shippingAddressEdit.zipCode" maxLength="5"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
                    <b-row class="mx-1">
                        <label for="inputShippingCountryEdit">Country</label>
                    </b-row>
                    <b-form-group id="inputGroupShippingCountry" class="w-100">
                        <b-form-input id="inputShippingCountryEdit" v-model="shippingAddressEdit.country"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-modal>
        <b-modal id="editBillingAddressModal" title="Edit Billing Address" size="lg" @cancel="closeEditBillingAddressModal">
            <b-row class="justify-content-end mx-2">
                <b-form-checkbox id="checkboxSameAsShipping" v-model="billingSameAsShipping"
                    name="checkboxSameAsShipping" value="same_as_shipping" unchecked-value="not_same_as_shipping">
                    Billing same as Shipping
                </b-form-checkbox>
            </b-row>
            <b-row>
                <b-col cols="12">
                    <b-row class="mx-1">
                        <label for="inputBillingStreet1Edit">Street and number, p.o. box, c/o</label>
                    </b-row>
                    <b-form-group id="inputGroupBillingStreet1" class="w-100">
                        <b-form-input id="inputBillingStreet1Edit" v-model="billingAddressEdit.street1" maxLength="100"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12">
                    <b-row class="mx-1">
                        <label for="inputBillingStreet2Edit">Apartment, suite, building, unit, floor, etc.</label>
                    </b-row>
                    <b-form-group id="inputGroupBillingStreet2" class="w-100">
                        <b-form-input id="inputBillingStreet2Edit" v-model="billingAddressEdit.street2" maxLength="100"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="3">
                    <b-row class="mx-1">
                        <label for="inputBillingCityEdit">City</label>
                    </b-row>
                    <b-form-group id="inputGroupBillingCity" class="w-100">
                        <b-form-input id="inputBillingCityEdit" v-model="billingAddressEdit.city" maxLength="100"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
                    <b-row class="mx-1">
                        <label for="inputBillingStateEdit">State</label>
                    </b-row>
                    <b-form-group id="inputGroupBillingState" class="w-100">
                        <b-form-select id="inputBillingStateEdit" v-model="billingAddressEdit.state" :options="listOfStates"></b-form-select>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
                    <b-row class="mx-1">
                        <label for="inputBillingZipCodeEdit">Zip Code</label>
                    </b-row>
                    <b-form-group id="inputGroupBillingZipCode" class="w-100">
                        <b-form-input id="inputBillingZipCodeEdit" v-model="billingAddressEdit.zipCode" maxLength="5"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
                    <b-row class="mx-1">
                        <label for="inputBillingCountryEdit">Country</label>
                    </b-row>
                    <b-form-group id="inputGroupBillingCountry" class="w-100">
                        <b-form-input id="inputBillingCountryEdit" v-model="billingAddressEdit.country"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-modal>
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
            userid: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
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
            cards: [],
            listOfStates: [],

            // Edit fields
            firstNameEdit: '',
            lastNameEdit: '',
            emailEdit: '',
            phoneEdit: '',
            dobEdit: '',
            passwordCurrent: '',
            passwordNew: '',
            passwordConfirm: '',
            shippingAddressEdit:
            {
                street1: '',
                street2: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
            },
            billingAddressEdit:
            {
                street1: '',
                street2: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',  
            },
            billingSameAsShipping: false,

            // Validation
            validation: {
                firstNameEdit: null,
                lastNameEdit: null,
            },

            // Error Feedback
            errorFeedback:
            {
                firstNameEdit: '',
                lastNameEdit: '',
            },
        }
    },
    computed: {
        fullName() {
            return `${this.firstName} ${this.lastName}`;
        },
    },

    // ====================================================
    // Lifecycle Methods
    // ====================================================
    created: async function() {
        console.log('Component is created. Template has not yet compiled. After created, check if there is a pre-compiled template, compile if there isn\'t one');
        // TODO: Get userid from the cookie/session instead of hardcoding here
        this.userid = 'USR-0000001';

        await this.fetchCurrentUser();
        this.performShowSuccessMessage(`Successfully fetched user`);
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
        async fetchCurrentUser()
        {
            const userid = this.userid;
            const apiUrl = `/jsonFetchUser/${userid}`;
            const jsonFetchCurrentUserOutput = await this.performGetHttpRequest(apiUrl);
            if (jsonFetchCurrentUserOutput['status'] != 'SUCCESS') return this.performShowErrorMessage(`Failed to fetch current user`);
            if (jsonFetchCurrentUserOutput['resultset'].length <= 0) return this.performShowErrorMessage(`Current user does not exist`);

            const jsonCurrentUser = jsonFetchCurrentUserOutput['resultset'][0];
            this.firstName = jsonCurrentUser['first_name'] || '';
            this.lastName = jsonCurrentUser['last_name'] || '';
            this.email = jsonCurrentUser['email'] || '';
            this.dob = jsonCurrentUser['dob'] || '';

            // Populate phone number
            if (jsonCurrentUser['json_user'] && jsonCurrentUser['json_user']['phone_number'])
            {
                const userPhoneNumber = jsonCurrentUser['json_user']['phone_number'];
                if (/[0-9]{3}-[0-9]{3}-[0-9]{4}/.test(userPhoneNumber))
                {
                    this.phone = userPhoneNumber;
                }
            }

            // Populate addresses
            if (jsonCurrentUser['json_address'])
            {
                if (jsonCurrentUser['json_address']['shipping'])
                {
                    this.shippingAddress['street1'] = jsonCurrentUser['json_address']['shipping']['street1'] || '';
                    this.shippingAddress['street2'] = jsonCurrentUser['json_address']['shipping']['street2'] || '';
                    this.shippingAddress['city'] = jsonCurrentUser['json_address']['shipping']['city'] || '';
                    this.shippingAddress['state'] = jsonCurrentUser['json_address']['shipping']['state'] || '';
                    this.shippingAddress['zipCode'] = jsonCurrentUser['json_address']['shipping']['zip_code'] || '';
                    this.shippingAddress['country'] = jsonCurrentUser['json_address']['shipping']['country'] || '';
                }
                if (jsonCurrentUser['json_address']['billing'])
                {
                    this.billingAddress['street1'] = jsonCurrentUser['json_address']['billing']['street1'] || '';
                    this.billingAddress['street2'] = jsonCurrentUser['json_address']['billing']['street2'] || '';
                    this.billingAddress['city'] = jsonCurrentUser['json_address']['billing']['city'] || '';
                    this.billingAddress['state'] = jsonCurrentUser['json_address']['billing']['state'] || '';
                    this.billingAddress['zipCode'] = jsonCurrentUser['json_address']['billing']['zip_code'] || '';
                    this.billingAddress['country'] = jsonCurrentUser['json_address']['billing']['country'] || '';
                }
            }

            // Populate cards
            console.log(jsonCurrentUser);
            if (jsonCurrentUser['json_user'] && jsonCurrentUser['json_user']['credit_cards'])
            {
                this.cards = jsonCurrentUser['json_user']['credit_cards'] || [];
            }
        },
        // Edit Modals
        openEditNameModal()
        {
            this.firstNameEdit = this.firstName;
            this.lastNameEdit = this.lastName;
            this.$bvModal.show('editNameModal');
        },
        closeEditNameModal()
        {
            this.resetNameEdit();
            this.resetNameEditValidation();
        },
        openEditEmailModal()
        {
            this.$bvModal.show('editEmailModal');
        },
        closeEditEmailModal()
        {
            this.emailEdit = '';
        },
        openEditPhoneModal()
        {
            this.$bvModal.show('editPhoneModal');
        },
        closeEditPhoneModal()
        {
            this.phoneEdit = '';
        },
        openEditDobModal()
        {
            this.$bvModal.show('editDobModal');
        },
        closeEditDobModal()
        {
            this.dobEdit = '';
        },
        openChangePasswordModal()
        {
            this.$bvModal.show('changePasswordModal');   
        },
        closeChangePasswordModal()
        {
            this.passwordCurrent = '';
            this.passwordNew = '';
            this.passwordConfirm = '';
        },
        openEditShippingAddressModal()
        {
            this.$bvModal.show('editShippingAddressModal');
        },
        closeEditShippingAddressModal()
        {
            this.resetShippingAddressEdit();
        },
        openEditBillingAddressModal()
        {
            this.$bvModal.show('editBillingAddressModal');
        },
        closeEditBillingAddressModal()
        {
            this.resetBillingAddressEdit();
        },
        // Edit Methods
        async saveCurrentUserFullName(event)
        {
            this.resetNameEditValidation();
            const firstNameEditTrimmed = this.firstNameEdit.trim();
            const lastNameEditTrimmed = this.lastNameEdit.trim();

            let errorMessage = '';
            // Validate first name
            if (errorMessage === '' && firstNameEditTrimmed.length == 0) errorMessage = `First Name is empty`;
            if (errorMessage === '' && firstNameEditTrimmed.length >= 100) errorMessage = `First Name cannot be longer than 100 characters`;
            if (errorMessage !== '')
            {
                this.validation['firstNameEdit'] = false;
                this.errorFeedback['firstNameEdit'] = errorMessage;
                event.preventDefault();
                return;
            }
            // Validate last name
            if (errorMessage === '' && lastNameEditTrimmed.length == 0) errorMessage = `Last Name is empty`;
            if (errorMessage === '' && lastNameEditTrimmed.length >= 100) errorMessage = `Last Name cannot be longer than 100 characters`;
            if (errorMessage !== '')
            {
                this.validation['lastNameEdit'] = false;
                this.errorFeedback['lastNameEdit'] = errorMessage;
                event.preventDefault();
                return;
            }
            // Validate full name
            if (errorMessage === '' && this.firstName == firstNameEditTrimmed && this.lastName == lastNameEditTrimmed) errorMessage = `First and Last Name hasn't changed`;
            if (errorMessage !== '')
            {
                this.validation['firstNameEdit'] = false;
                this.validation['lastNameEdit'] = false;
                this.errorFeedback['firstNameEdit'] = errorMessage;
                event.preventDefault();
                return;
            }

            console.log('first and last name is valid');
            
        },
        // Reset
        resetNameEdit()
        {
            this.firstNameEdit = '';
            this.lastNameEdit = '';
        },
        resetNameEditValidation()
        {
            this.validation['firstNameEdit'] = null;
            this.validation['lastNameEdit'] = null;
            this.errorFeedback['firstNameEdit'] = '';
            this.errorFeedback['lastNameEdit'] = '';
        },
        resetShippingAddressEdit()
        {
            this.shippingAddressEdit['street1'] = '';
            this.shippingAddressEdit['street2'] = '';
            this.shippingAddressEdit['city'] = '';
            this.shippingAddressEdit['state'] = '';
            this.shippingAddressEdit['zipCode'] = '';
            this.shippingAddressEdit['country'] = '';
        },
        resetBillingAddressEdit()
        {
            this.billingAddressEdit['street1'] = '';
            this.billingAddressEdit['street2'] = '';
            this.billingAddressEdit['city'] = '';
            this.billingAddressEdit['state'] = '';
            this.billingAddressEdit['zipCode'] = '';
            this.billingAddressEdit['country'] = '';
        },
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
