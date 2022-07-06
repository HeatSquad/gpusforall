<template>
    <b-container fluid class="user-profile-management-container" style="border: 1px dashed red">
        <b-row class="justify-content-end py-2 mb-4">
            <b-button class="mx-2 px-4" @click="navigateToOrders">Orders</b-button>
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
                                <b-form-input id="inputPhone" v-model="phone" type="tel" placeholder="##########" maxLength="10" disabled></b-form-input>
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
                    <b-row class="justify-content-end">
                        <b-button class="mx-3 px-4" variant="primary" @click="openChangePasswordModal">Change Password</b-button>
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
                                <label for="selectShippingState">State</label>
                            </b-row>
                            <b-form-group id="selectGroupShippingState" class="w-100">
                                <b-form-select id="selectShippingState" v-model="shippingAddress.state" :options="listOfStates" disabled></b-form-select>
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
                                <label for="selectBillingState">State</label>
                            </b-row>
                            <b-form-group id="selectGroupBillingState" class="w-100">
                                <b-form-select id="selectBillingState" v-model="billingAddress.state" :options="listOfStates" disabled></b-form-select>
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
                    <b-row v-if="creditCards.length <= 0" class="mx-2">
                        No payment information saved.
                    </b-row>
                    <b-row v-for="(cardObject, index) in creditCards" :key="'card_'+index" align-h="between" class="border-bottom mx-1 mb-3">
                        <b-col cols="4">
                            <div class="font-weight-bold text-black-75">{{cardObject.network}} ending in {{cardObject.lastFourDigits}}</div>
                            <div class="text-muted">{{cardObject.expirationMonth}}/{{cardObject.expirationYear}}</div>
                        </b-col>
                        <b-col cols="6">
                            <b-badge v-if="cardObject.isPrimary" variant="secondary" class="px-4 py-2">Default</b-badge>
                        </b-col>
                        <b-col cols="auto">
                            <b-button class="px-4" @click="openEditCardPaymentModal(index)">Edit</b-button>
                        </b-col>
                    </b-row>
                    <b-row class="justify-content-end">
                        <b-button class="px-4 mx-4" variant="primary" @click="openAddCardPaymentModal">Add Payment Method</b-button>
                    </b-row>
                </b-card>
            </b-col>
        </b-row>
        <!-- Modals -->
        <b-modal id="editNameModal" title="Edit Name" size="lg">
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
            <template #modal-footer>
                <b-button class="px-3 py-2 mx-2" variant="secondary" @click="closeEditNameModal">Cancel</b-button>
                <b-button class="px-3 py-2 mx-2" variant="primary" @click="saveCurrentUserFullName">Confirm</b-button>
            </template>
        </b-modal>
        <b-modal id="editEmailModal" title="Edit Email" size="lg">
            <b-form-group id="inputGroupEmailEdit" label="Email:" label-for="inputEmailEdit">
                <b-form-input id="inputEmailEdit" v-model="emailEdit" type="email" placeholder="Enter email" maxLength="320"
                :state="validation['emailEdit']" aria-describedby="inputEmailEditFeedback"></b-form-input>
                <b-form-invalid-feedback id="inputEmailEditFeedback">{{this.errorFeedback['emailEdit']}}</b-form-invalid-feedback>
            </b-form-group>
            <template #modal-footer>
                <b-button class="px-3 py-2 mx-2" variant="secondary" @click="closeEditEmailModal">Cancel</b-button>
                <b-button class="px-3 py-2 mx-2" variant="primary" @click="saveEmail">Confirm</b-button>
            </template>
        </b-modal>
        <b-modal id="editPhoneModal" title="Edit Phone Number" size="lg">
            <b-form-group id="inputGroupPhoneEdit" label="Phone:" label-for="inputPhoneEdit">
                <b-form-input id="inputPhoneEdit" v-model="phoneEdit" type="tel" placeholder="##########" maxLength="10"
                :state="validation['phoneEdit']" aria-describedby="inputPhoneEditFeedback"></b-form-input>
                <b-form-invalid-feedback id="inputPhoneEditFeedback">{{this.errorFeedback['phoneEdit']}}</b-form-invalid-feedback>
            </b-form-group>
            <template #modal-footer>
                <b-button class="px-3 py-2 mx-2" variant="secondary" @click="closeEditPhoneModal">Cancel</b-button>
                <b-button class="px-3 py-2 mx-2" variant="primary" @click="savePhone">Confirm</b-button>
            </template>
        </b-modal>
        <b-modal id="editDobModal" title="Edit Date of Birth" size="lg">
            <b-form-group id="inputGroupDobEdit" label="Date of Birth:" label-for="inputDobEdit">
                <b-form-input id="inputDobEdit" v-model="dobEdit" type="date"
                :state="validation['dobEdit']" aria-describedby="inputDobEditFeedback"></b-form-input>
                <b-form-invalid-feedback id="inputDobEditFeedback">{{this.errorFeedback['dobEdit']}}</b-form-invalid-feedback>
            </b-form-group>
            <template #modal-footer>
                <b-button class="px-3 py-2 mx-2" variant="secondary" @click="closeEditDobModal">Cancel</b-button>
                <b-button class="px-3 py-2 mx-2" variant="primary" @click="saveDob">Confirm</b-button>
            </template>
        </b-modal>
        <b-modal id="changePasswordModal" title="Change Password" size="lg">
            <div>
                We recommend that passwords should
                <ol>
                    <li>Be at least 12 characters</li>
                    <li>Contain uppercase, lowercase, numerical, and special characters</li>
                    <li>Not be reused for multiple accounts</li>
                    <li>Not contain sensitive or identifying information</li>
                </ol>
            </div>
            <br>
            <b-form-group id="inputGroupPasswordCurrentEdit" label="Current Password:" label-for="inputPasswordCurrentEdit">
                <b-form-input id="inputPasswordCurrentEdit" v-model="passwordCurrentEdit" type="password" placeholder="Enter current password" maxLength="100"
                :state="validation['passwordCurrentEdit']" aria-describedby="inputPasswordCurrentEditFeedback"></b-form-input>
                <b-form-invalid-feedback id="inputPasswordCurrentEditFeedback">{{this.errorFeedback['passwordCurrentEdit']}}</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group id="inputGroupPasswordNewEdit" label="New Password:" label-for="inputPasswordNewEdit">
                <b-form-input id="inputPasswordNewEdit" v-model="passwordNewEdit" type="password" placeholder="New password" maxLength="100"
                :state="validation['passwordNewEdit']" aria-describedby="inputPasswordNewEditFeedback"></b-form-input>
                <b-form-invalid-feedback id="inputPasswordNewEditFeedback">{{this.errorFeedback['passwordNewEdit']}}</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group id="inputGroupPasswordConfirmEdit" label="Confirm New Password:" label-for="inputPasswordConfirmEdit">
                <b-form-input id="inputPasswordConfirmEdit" v-model="passwordConfirmEdit" type="password" placeholder="Confirm new password" maxLength="100"
                :state="validation['passwordConfirmEdit']" aria-describedby="inputPasswordConfirmEditFeedback"></b-form-input>
                <b-form-invalid-feedback id="inputPasswordConfirmEditFeedback">{{this.errorFeedback['passwordConfirmEdit']}}</b-form-invalid-feedback>
            </b-form-group>
            <template #modal-footer>
                <b-button class="px-3 py-2 mx-2" variant="secondary" @click="closeChangePasswordModal">Cancel</b-button>
                <b-button class="px-3 py-2 mx-2" variant="primary" @click="savePassword">Confirm</b-button>
            </template>
        </b-modal>
        <b-modal id="editShippingAddressModal" title="Edit Shipping Address" size="lg">
            <b-row>
                <b-col cols="12">
                    <b-row class="mx-1">
                        <label for="inputShippingStreet1Edit">Street and number, p.o. box, c/o</label>
                    </b-row>
                    <b-form-group id="inputGroupShippingStreet1Edit" class="w-100">
                        <b-form-input id="inputShippingStreet1Edit" v-model="shippingAddressEdit.street1" maxLength="100"
                        :state="validation['shippingEditStreet1']" aria-describedby="inputShippingEditStreet1Feedback"></b-form-input>
                        <b-form-invalid-feedback id="inputShippingEditStreet1Feedback">{{this.errorFeedback['shippingEditStreet1']}}</b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12">
                    <b-row class="mx-1">
                        <label for="inputShippingStreet2Edit">Apartment, suite, building, unit, floor, etc.</label>
                    </b-row>
                    <b-form-group id="inputGroupShippingStreet2Edit" class="w-100">
                        <b-form-input id="inputShippingStreet2Edit" v-model="shippingAddressEdit.street2" maxLength="100"
                        :state="validation['shippingEditStreet2']" aria-describedby="inputShippingEditStreet2Feedback"></b-form-input>
                        <b-form-invalid-feedback id="inputShippingEditStreet2Feedback">{{this.errorFeedback['shippingEditStreet2']}}</b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="3">
                    <b-row class="mx-1">
                        <label for="inputShippingCityEdit">City</label>
                    </b-row>
                    <b-form-group id="inputGroupShippingCityEdit" class="w-100">
                        <b-form-input id="inputShippingCityEdit" v-model="shippingAddressEdit.city" maxLength="100"
                        :state="validation['shippingEditCity']" aria-describedby="inputShippingEditCityFeedback"></b-form-input>
                        <b-form-invalid-feedback id="inputShippingEditCityFeedback">{{this.errorFeedback['shippingEditCity']}}</b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
                    <b-row class="mx-1">
                        <label for="selectShippingStateEdit">State</label>
                    </b-row>
                    <b-form-group id="selectGroupShippingStateEdit" class="w-100">
                        <b-form-select id="selectShippingStateEdit" v-model="shippingAddressEdit.state" :options="listOfStates"
                        :state="validation['shippingEditState']" aria-describedby="inputShippingEditStateFeedback"></b-form-select>
                        <b-form-invalid-feedback id="inputShippingEditStateFeedback">{{this.errorFeedback['shippingEditState']}}</b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
                    <b-row class="mx-1">
                        <label for="inputShippingZipCodeEdit">Zip Code</label>
                    </b-row>
                    <b-form-group id="inputGroupShippingZipCodeEdit" class="w-100">
                        <b-form-input id="inputShippingZipCodeEdit" v-model="shippingAddressEdit.zipCode" maxLength="5"
                        :state="validation['shippingEditZipCode']" aria-describedby="inputShippingEditZipCodeFeedback"></b-form-input>
                        <b-form-invalid-feedback id="inputShippingEditZipCodeFeedback">{{this.errorFeedback['shippingEditZipCode']}}</b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
                    <b-row class="mx-1">
                        <label for="inputShippingCountryEdit">Country</label>
                    </b-row>
                    <b-form-group id="inputGroupShippingCountryEdit" class="w-100">
                        <b-form-input id="inputShippingCountryEdit" v-model="shippingAddressEdit.country" maxLength="80"
                        :state="validation['shippingEditCountry']" aria-describedby="inputShippingEditCountryFeedback"></b-form-input>
                        <b-form-invalid-feedback id="inputShippingEditCountryFeedback">{{this.errorFeedback['shippingEditCountry']}}</b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
            </b-row>
            <template #modal-footer>
                <b-button class="px-3 py-2 mx-2" variant="secondary" @click="closeEditShippingAddressModal">Cancel</b-button>
                <b-button class="px-3 py-2 mx-2" variant="primary" @click="saveShippingAddress">Confirm</b-button>
            </template>
        </b-modal>
        <b-modal id="editBillingAddressModal" title="Edit Billing Address" size="lg">
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
                    <b-form-group id="inputGroupBillingStreet1Edit" class="w-100">
                        <b-form-input id="inputBillingStreet1Edit" v-model="billingAddressEdit.street1" maxLength="100"
                        :state="validation['billingEditStreet1']" aria-describedby="inputBillingEditStreet1Feedback"></b-form-input>
                        <b-form-invalid-feedback id="inputBillingEditStreet1Feedback">{{this.errorFeedback['billingEditStreet1']}}</b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12">
                    <b-row class="mx-1">
                        <label for="inputBillingStreet2Edit">Apartment, suite, building, unit, floor, etc.</label>
                    </b-row>
                    <b-form-group id="inputGroupBillingStreet2Edit" class="w-100">
                        <b-form-input id="inputBillingStreet2Edit" v-model="billingAddressEdit.street2" maxLength="100"
                        :state="validation['billingEditStreet2']" aria-describedby="inputBillingEditStreet2Feedback"></b-form-input>
                        <b-form-invalid-feedback id="inputBillingEditStreet2Feedback">{{this.errorFeedback['billingEditStreet2']}}</b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="3">
                    <b-row class="mx-1">
                        <label for="inputBillingCityEdit">City</label>
                    </b-row>
                    <b-form-group id="inputGroupBillingCityEdit" class="w-100">
                        <b-form-input id="inputBillingCityEdit" v-model="billingAddressEdit.city" maxLength="100"
                        :state="validation['billingEditCity']" aria-describedby="inputBillingEditCityFeedback"></b-form-input>
                        <b-form-invalid-feedback id="inputBillingEditCityFeedback">{{this.errorFeedback['billingEditCity']}}</b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
                    <b-row class="mx-1">
                        <label for="selectBillingStateEdit">State</label>
                    </b-row>
                    <b-form-group id="selectGroupBillingStateEdit" class="w-100">
                        <b-form-select id="selectBillingStateEdit" v-model="billingAddressEdit.state" :options="listOfStates"
                        :state="validation['billingEditState']" aria-describedby="inputBillingEditStateFeedback"></b-form-select>
                        <b-form-invalid-feedback id="inputBillingEditStateFeedback">{{this.errorFeedback['billingEditState']}}</b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
                    <b-row class="mx-1">
                        <label for="inputBillingZipCodeEdit">Zip Code</label>
                    </b-row>
                    <b-form-group id="inputGroupBillingZipCodeEdit" class="w-100">
                        <b-form-input id="inputBillingZipCodeEdit" v-model="billingAddressEdit.zipCode" maxLength="5"
                        :state="validation['billingEditZipCode']" aria-describedby="inputBillingEditZipCodeFeedback"></b-form-input>
                        <b-form-invalid-feedback id="inputBillingEditZipCodeFeedback">{{this.errorFeedback['billingEditZipCode']}}</b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
                    <b-row class="mx-1">
                        <label for="inputBillingCountryEdit">Country</label>
                    </b-row>
                    <b-form-group id="inputGroupBillingCountryEdit" class="w-100">
                        <b-form-input id="inputBillingCountryEdit" v-model="billingAddressEdit.country" maxLength="80"
                        :state="validation['billingEditCountry']" aria-describedby="inputBillingEditCountryFeedback"></b-form-input>
                        <b-form-invalid-feedback id="inputBillingEditCountryFeedback">{{this.errorFeedback['billingEditCountry']}}</b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
            </b-row>
            <template #modal-footer>
                <b-button class="px-3 py-2 mx-2" variant="secondary" @click="closeEditBillingAddressModal">Cancel</b-button>
                <b-button class="px-3 py-2 mx-2" variant="primary" @click="saveBillingAddress">Confirm</b-button>
            </template>
        </b-modal>
        <b-modal id="editCardPaymentModal" title="Edit Card Payment" size="lg">
            <div v-if="currentCreditCardIndex != null">
                <b-row>
                    <b-col cols="6">
                        <b-row class="align-items-start">
                            <b-col cols="6">
                                <b-form-group id="selectGroupExpirationMonthEdit" label="Expiry Month" label-for="selectExpirationMonthEdit" class="mr-3">
                                    <b-form-select id="selectExpirationMonthEdit" v-model="creditCardEdit.expirationMonth" :options="expirationMonthOptions"
                                    :state="validation['cardExpirationMonthEdit']" aria-describedby="selectCardExpirationMonthEditFeedback"></b-form-select>
                                    <b-form-invalid-feedback id="selectCardExpirationMonthEditFeedback">{{this.errorFeedback['cardExpirationMonthEdit']}}</b-form-invalid-feedback>
                                </b-form-group>
                            </b-col>
                            <b-col cols="6">
                                <b-form-group id="inputGroupExpirationYearEdit" label="Expiry Year" label-for="inputExpirationYearEdit">
                                    <b-form-input id="inputExpirationYearEdit" v-model="creditCardEdit.expirationYear" maxLength="4" placeholder="Year"
                                    :state="validation['cardExpirationYearEdit']" aria-describedby="inputCardExpirationYearEditFeedback"></b-form-input>
                                    <b-form-invalid-feedback id="inputCardExpirationYearEditFeedback">{{this.errorFeedback['cardExpirationYearEdit']}}</b-form-invalid-feedback>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </div>
            <template #modal-footer>
                <b-button class="px-3 py-2 mx-2" variant="secondary" @click="closeEditCardPaymentModal">Cancel</b-button>
                <b-button class="px-3 py-2 mx-2" variant="primary" @click="saveCardPayment">Confirm</b-button>
            </template>
        </b-modal>
        <b-modal id="addCardPaymentModal" title="Add Card Payment" size="lg">
            <b-row>
                <b-col cols="12">
                    <b-form-group id="inputGroupCardholderNameAdd" label="Cardholder's name" label-for="inputCardholderNameAdd">
                        <b-form-input id="inputCardholderNameAdd" v-model="creditCardAdd.cardholderName" maxLength="202"
                        :state="validation['cardholderNameAdd']" aria-describedby="inputCardholderNameAddFeedback"></b-form-input>
                        <b-form-invalid-feedback id="inputCardholderNameAddFeedback">{{this.errorFeedback['cardholderNameAdd']}}</b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="6">
                    <b-form-group id="inputGroupCardNumberAdd" label="Credit card number" label-for="inputCardNumberAdd">
                        <b-form-input id="inputCardNumberAdd" v-model="creditCardAdd.cardNumber" maxLength="16"
                        :state="validation['cardNumberAdd']" aria-describedby="inputCardNumberAddFeedback"></b-form-input>
                        <b-form-invalid-feedback id="inputCardNumberAddFeedback">{{this.errorFeedback['cardNumberAdd']}}</b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
                <b-col cols="6">
                    <b-row class="align-items-start">
                        <b-col cols="6">
                            <b-form-group id="selectGroupExpirationMonthAdd" label="Expiry Month" label-for="selectExpirationMonthAdd" class="mr-3">
                                <b-form-select id="selectExpirationMonthAdd" v-model="creditCardAdd.expirationMonth" :options="expirationMonthOptions"
                                :state="validation['cardExpirationMonthAdd']" aria-describedby="selectCardExpirationMonthAddFeedback"></b-form-select>
                                <b-form-invalid-feedback id="selectCardExpirationMonthAddFeedback">{{this.errorFeedback['cardExpirationMonthAdd']}}</b-form-invalid-feedback>
                            </b-form-group>
                        </b-col>
                        <b-col cols="6">
                            <b-form-group id="inputGroupExpirationYearAdd" label="Expiry Year" label-for="inputExpirationYearAdd">
                                <b-form-input id="inputExpirationYearAdd" v-model="creditCardAdd.expirationYear" maxLength="4" placeholder="Year"
                                :state="validation['cardExpirationYearAdd']" aria-describedby="inputCardExpirationYearAddFeedback"></b-form-input>
                                <b-form-invalid-feedback id="inputCardExpirationYearAddFeedback">{{this.errorFeedback['cardExpirationYearAdd']}}</b-form-invalid-feedback>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <template #modal-footer>
                <b-button class="px-3 py-2 mx-2" variant="secondary" @click="closeAddCardPaymentModal">Cancel</b-button>
                <b-button class="px-3 py-2 mx-2" variant="primary" @click="addCardPayment">Confirm</b-button>
            </template>
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
import { listOfStates, listOfNumericMonths } from '../util/constants';
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
            creditCards: [],
            listOfStates: [],

            // Edit fields
            firstNameEdit: '',
            lastNameEdit: '',
            emailEdit: '',
            phoneEdit: '',
            dobEdit: '',
            passwordCurrentEdit: '',
            passwordNewEdit: '',
            passwordConfirmEdit: '',
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
            creditCardEdit:
            {
                expirationMonth: null,
                expirationYear: '',
                isPrimary: false,
            },
            creditCardAdd:
            {
                cardNetwork: '',
                cardholderName: '',
                cardNumber: '',
                expirationMonth: null,
                expirationYear: '',
                isPrimary: false,
            },
            expirationMonthOptions: [],
            currentCreditCardIndex: null,

            // Validation
            validation: {
                firstNameEdit: null,
                lastNameEdit: null,
                emailEdit: null,
                phoneEdit: null,
                dobEdit: null,
                passwordCurrentEdit: null,
                passwordNewEdit: null,
                passwordConfirmEdit: null,
                shippingEditStreet1: null,
                shippingEditStreet2: null,
                shippingEditCity: null,
                shippingEditState: null,
                shippingEditZipCode: null,
                shippingEditCountry: null,
                billingEditStreet1: null,
                billingEditStreet2: null,
                billingEditCity: null,
                billingEditState: null,
                billingEditZipCode: null,
                billingEditCountry: null,
                cardholderNameEdit: null,
                cardNumberEdit: null,
                cardExpirationMonthEdit: null,
                cardExpirationYearEdit: null,
                cardholderNameAdd: null,
                cardNumberAdd: null,
                cardExpirationMonthAdd: null,
                cardExpirationYearAdd: null,
            },

            // Error Feedback
            errorFeedback:
            {
                firstNameEdit: '',
                lastNameEdit: '',
                emailEdit: '',
                phoneEdit: '',
                dobEdit: '',
                passwordCurrentEdit: '',
                passwordNewEdit: '',
                passwordConfirmEdit: '',
                shippingEditStreet1: '',
                shippingEditStreet2: '',
                shippingEditCity: '',
                shippingEditState: '',
                shippingEditZipCode: '',
                shippingEditCountry: '',
                billingEditStreet1: '',
                billingEditStreet2: '',
                billingEditCity: '',
                billingEditState: '',
                billingEditZipCode: '',
                billingEditCountry: '',
                cardholderNameEdit: '',
                cardNumberEdit: '',
                cardExpirationMonthEdit: '',
                cardExpirationYearEdit: '',
                cardholderNameAdd: '',
                cardNumberAdd: '',
                cardExpirationMonthAdd: '',
                cardExpirationYearAdd: '',
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
        this.userid = 'USR00002';

        // Card Expiration Month options
        const mappedNumericMonths = listOfNumericMonths.map((m) => {
            return { text: m, value: m };
        });
        const expirationMonthOptions = [{ text: 'Month', value: null }].concat(mappedNumericMonths);
        console.log(expirationMonthOptions);
        this.expirationMonthOptions = expirationMonthOptions;        

        await this.fetchCurrentUser();
        await this.fetchCurrentUserPaymentInfo();
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
        navigateToOrders()
        {
            // this.$router.push({
            //     name: 'About',
            //     params: {test: 'testing stuff'},
            // });
        },
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

            console.log(jsonCurrentUser);

            // Populate phone number
            if (jsonCurrentUser['phone_number'])
            {
                const userPhoneNumber = jsonCurrentUser['phone_number'];
                if (/[0-9]{3}[0-9]{3}[0-9]{4}/.test(userPhoneNumber))
                {
                    this.phone = userPhoneNumber;
                }
            }

            // Populate addresses
            // if (jsonCurrentUser['json_address']) jsonCurrentUser['json_address'] = JSON.parse(jsonCurrentUser['json_address']);
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
        },
        async fetchCurrentUserPaymentInfo()
        {
            const userid = this.userid;
            const apiUrl = `/jsonFetchUserPaymentInfo/${userid}`;
            const jsonFetchCurrentUserOutput = await this.performGetHttpRequest(apiUrl);
            if (jsonFetchCurrentUserOutput['status'] != 'SUCCESS') return this.performShowErrorMessage(`Failed to fetch current user's payment information`);
            if (jsonFetchCurrentUserOutput['resultset'].length <= 0)
            {
                this.creditCards = [];
                return;
            }

            // Sort so primary is at start
            const arrayJsonCreditCards = jsonFetchCurrentUserOutput['resultset'];
            const formattedArrayJsonCreditCards = [];
            for (const jsonCreditCard of arrayJsonCreditCards)
            {
                const jsonFormattedCreditCard = {};
                jsonFormattedCreditCard['uuid'] = jsonCreditCard['uuid'];
                jsonFormattedCreditCard['network'] = jsonCreditCard['network'];
                jsonFormattedCreditCard['lastFourDigits'] = jsonCreditCard['last_four_digits'];
                jsonFormattedCreditCard['expirationMonth'] = jsonCreditCard['expiration_month'];
                jsonFormattedCreditCard['expirationYear'] = jsonCreditCard['expiration_year'];
                jsonFormattedCreditCard['isPrimary'] = jsonCreditCard['is_primary'];
                formattedArrayJsonCreditCards.push(jsonFormattedCreditCard);
            }
            formattedArrayJsonCreditCards.sort((a, b) => {
                if (a['is_primary'] === true) return -1;
                if (b['is_primary'] === true) return 1;
                return 0;
            });
            this.creditCards = formattedArrayJsonCreditCards;
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
            this.$bvModal.hide('editNameModal');
        },
        openEditEmailModal()
        {
            this.emailEdit = this.email;
            this.$bvModal.show('editEmailModal');
        },
        closeEditEmailModal()
        {
            this.resetEmailEdit();
            this.resetEmailEditValidation();
            this.$bvModal.hide('editEmailModal');
        },
        openEditPhoneModal()
        {
            this.phoneEdit = this.phone;
            this.$bvModal.show('editPhoneModal');
        },
        closeEditPhoneModal()
        {
            this.resetPhoneEdit();
            this.resetPhoneEditValidation();
            this.$bvModal.hide('editPhoneModal');
        },
        openEditDobModal()
        {
            this.dobEdit = this.dob;
            this.$bvModal.show('editDobModal');
        },
        closeEditDobModal()
        {
            this.resetDobEdit();
            this.resetDobEditValidation();
            this.$bvModal.hide('editDobModal');
        },
        openChangePasswordModal()
        {
            this.$bvModal.show('changePasswordModal');
        },
        closeChangePasswordModal()
        {
            this.resetPasswordEdit();
            this.resetPasswordEditValidation();
            this.$bvModal.hide('changePasswordModal');
        },
        openEditShippingAddressModal()
        {
            this.shippingAddressEdit['street1'] = this.shippingAddress['street1'];
            this.shippingAddressEdit['street2'] = this.shippingAddress['street2'];
            this.shippingAddressEdit['city'] = this.shippingAddress['city'];
            this.shippingAddressEdit['state'] = this.shippingAddress['state'];
            this.shippingAddressEdit['zipCode'] = this.shippingAddress['zipCode'];
            this.shippingAddressEdit['country'] = this.shippingAddress['country'];
            this.$bvModal.show('editShippingAddressModal');
        },
        closeEditShippingAddressModal()
        {
            this.resetShippingAddressEdit();
            this.resetShippingAddressEditValidation();
            this.$bvModal.hide('editShippingAddressModal');
        },
        openEditBillingAddressModal()
        {
            this.billingAddressEdit['street1'] = this.billingAddress['street1'];
            this.billingAddressEdit['street2'] = this.billingAddress['street2'];
            this.billingAddressEdit['city'] = this.billingAddress['city'];
            this.billingAddressEdit['state'] = this.billingAddress['state'];
            this.billingAddressEdit['zipCode'] = this.billingAddress['zipCode'];
            this.billingAddressEdit['country'] = this.billingAddress['country'];
            this.$bvModal.show('editBillingAddressModal');
        },
        closeEditBillingAddressModal()
        {
            this.resetBillingAddressEdit();
            this.resetBillingAddressEditValidation();
            this.$bvModal.hide('editBillingAddressModal');
        },
        openEditCardPaymentModal(index)
        {
            this.currentCreditCardIndex = index;
            const jsonCreditCardToEdit = this.creditCards[index];
            this.creditCardEdit['expirationMonth'] = jsonCreditCardToEdit['expirationMonth'];
            this.creditCardEdit['expirationYear'] = jsonCreditCardToEdit['expirationYear'];
            this.creditCardEdit['isPrimary'] = jsonCreditCardToEdit['isPrimary'];
            this.$bvModal.show('editCardPaymentModal');
        },
        closeEditCardPaymentModal()
        {
            this.resetEditCardPayment();
            this.resetEditCardPaymentValidation();
            this.$bvModal.hide('editCardPaymentModal');
        },
        openAddCardPaymentModal()
        {
            this.$bvModal.show('addCardPaymentModal');
        },
        closeAddCardPaymentModal()
        {
            this.resetAddCardPayment();
            this.resetAddCardPaymentValidation();
            this.$bvModal.hide('addCardPaymentModal');
        },
        // Edit Methods
        async saveCurrentUserFullName()
        {
            this.resetNameEditValidation();
            const firstNameEditTrimmed = this.firstNameEdit.trim();
            const lastNameEditTrimmed = this.lastNameEdit.trim();

            let errorMessage = '';
            // Validate first name
            if (errorMessage === '' && firstNameEditTrimmed.length === 0) errorMessage = `First Name is empty`;
            if (errorMessage === '' && firstNameEditTrimmed.length > 100) errorMessage = `First Name cannot be longer than 100 characters`;
            if (errorMessage !== '')
            {
                this.validation['firstNameEdit'] = false;
                this.errorFeedback['firstNameEdit'] = errorMessage;
                return;
            }
            // Validate last name
            if (errorMessage === '' && lastNameEditTrimmed.length === 0) errorMessage = `Last Name is empty`;
            if (errorMessage === '' && lastNameEditTrimmed.length > 100) errorMessage = `Last Name cannot be longer than 100 characters`;
            if (errorMessage !== '')
            {
                this.validation['lastNameEdit'] = false;
                this.errorFeedback['lastNameEdit'] = errorMessage;
                return;
            }
            // Validate full name
            if (errorMessage === '' && this.firstName == firstNameEditTrimmed && this.lastName == lastNameEditTrimmed) errorMessage = `First and Last Name hasn't changed`;
            if (errorMessage !== '')
            {
                this.validation['firstNameEdit'] = false;
                this.validation['lastNameEdit'] = false;
                this.errorFeedback['firstNameEdit'] = errorMessage;
                return;
            }
            
            const userid = this.userid;
            const apiUrl = `/jsonUpdateUserFullName`;
            const apiParams = {};
            apiParams['userid'] = userid;
            apiParams['first_name'] = firstNameEditTrimmed;
            apiParams['last_name'] = lastNameEditTrimmed;
            const jsonFetchCurrentUserOutput = await this.performPutHttpRequest(apiUrl, apiParams);
            if (jsonFetchCurrentUserOutput['status'] != 'SUCCESS')
            {
                this.performShowErrorMessage(`Failed to update user's name. ${jsonFetchCurrentUserOutput['message']}`);
                return;
            }

            this.firstName = firstNameEditTrimmed;
            this.lastName = lastNameEditTrimmed;
            this.closeEditNameModal();
            this.performShowSuccessMessage(`Your name was updated`);
        },
        async saveEmail()
        {
            this.resetEmailEditValidation();
            const email = this.emailEdit.trim();

            let errorMessage = '';
            // Validate email
            if (errorMessage === '' && email.length === 0) errorMessage = `Email is empty`;
            if (errorMessage === '' && email.length > 320) errorMessage = `Email cannot be longer than 320 characters`;
            const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (errorMessage === '' && !emailRegex.test(email)) errorMessage = `Email is an invalid format`;
            if (errorMessage !== '')
            {
                this.validation['emailEdit'] = false;
                this.errorFeedback['emailEdit'] = errorMessage;
                return;
            }

            const userid = this.userid;
            const apiUrl = `/jsonUpdateUserEmail`;
            const apiParams = {};
            apiParams['userid'] = userid;
            apiParams['email'] = email;
            const jsonUpdateEmailOutput = await this.performPutHttpRequest(apiUrl, apiParams);
            if (jsonUpdateEmailOutput['status'] != 'SUCCESS')
            {
                this.performShowErrorMessage(`Failed to update user's email. ${jsonUpdateEmailOutput['message']}`);
                return;
            }

            this.email = email;
            this.closeEditEmailModal();
            this.performShowSuccessMessage(`Your email was updated`);
        },
        async savePhone()
        {
            this.resetPhoneEditValidation();
            const phone = this.phoneEdit.trim();

            let errorMessage = '';
            // Validate phone
            if (errorMessage === '' && phone.length === 0) errorMessage = `Phone is empty`;
            if (errorMessage === '' && phone.length > 10) errorMessage = `Phone cannot be longer than 10 characters`;
            // const phoneRegex = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;
            const phoneRegex = /[0-9]{10}/;
            if (errorMessage === '' && !phoneRegex.test(phone)) errorMessage = `Phone is an invalid format`;
            if (errorMessage !== '')
            {
                this.validation['phoneEdit'] = false;
                this.errorFeedback['phoneEdit'] = errorMessage;
                return;
            }

            const userid = this.userid;
            const apiUrl = `/jsonUpdateUserPhoneNumber`;
            const apiParams = {};
            apiParams['userid'] = userid;
            apiParams['phone'] = phone;
            const jsonUpdateUserPhoneNumberOutput = await this.performPutHttpRequest(apiUrl, apiParams);
            if (jsonUpdateUserPhoneNumberOutput['status'] != 'SUCCESS')
            {
                this.performShowErrorMessage(`Failed to update user's phone number. ${jsonUpdateUserPhoneNumberOutput['message']}`);
                return;
            }

            this.phone = phone;
            this.closeEditPhoneModal();
            this.performShowSuccessMessage(`Your phone number was updated`);
        },
        async saveDob()
        {
            this.resetDobEditValidation();
            const dob = this.dobEdit.trim();

            let errorMessage = '';
            // Validate dob
            if (errorMessage === '' && dob.length === 0) errorMessage = `Date of Birth is empty`;
            if (errorMessage === '' && dob.length > 10) errorMessage = `Date of Birth cannot be longer than 10 characters`;
            const dobRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
            if (errorMessage === '' && !dobRegex.test(dob)) errorMessage = `Date of Birth is an invalid format`;
            if (errorMessage !== '')
            {
                this.validation['dobEdit'] = false;
                this.errorFeedback['dobEdit'] = errorMessage;
                return;
            }

            const userid = this.userid;
            const apiUrl = `/jsonUpdateUserDob`;
            const apiParams = {};
            apiParams['userid'] = userid;
            apiParams['dob'] = dob;
            const jsonUpdateUserDobOutput = await this.performPutHttpRequest(apiUrl, apiParams);
            if (jsonUpdateUserDobOutput['status'] != 'SUCCESS')
            {
                this.performShowErrorMessage(`Failed to update user's date of birth. ${jsonUpdateUserDobOutput['message']}`);
                return;
            }

            this.dob = dob;
            this.closeEditDobModal();
            this.performShowSuccessMessage(`Your date of birth was updated`);
        },
        async savePassword()
        {
            this.resetPasswordEditValidation();
            const currentPassword = this.passwordCurrentEdit.trim();
            const newPassword = this.passwordNewEdit.trim();
            const confirmPassword = this.passwordConfirmEdit.trim();

            let errorMessage = '';
            // Validate Current Password
            if (errorMessage === '' && currentPassword.length === 0) errorMessage = `Current password is empty`;
            if (errorMessage === '' && currentPassword.length < 12) errorMessage = `Passwords must be at least 12 characters`;
            if (errorMessage === '' && currentPassword.length > 100) errorMessage = `Passwords cannot be longer than 100 characters`;
            if (errorMessage !== '')
            {
                this.validation['passwordCurrentEdit'] = false;
                this.errorFeedback['passwordCurrentEdit'] = errorMessage;
                return;
            }
            // Validate New Password
            if (errorMessage === '' && newPassword.length === 0) errorMessage = `New password is empty`;
            if (errorMessage === '' && newPassword.length < 12) errorMessage = `Passwords must be at least 12 characters`;
            if (errorMessage === '' && newPassword.length > 100) errorMessage = `Passwords cannot be longer than 100 characters`;
            if (errorMessage !== '')
            {
                this.validation['passwordNewEdit'] = false;
                this.errorFeedback['passwordNewEdit'] = errorMessage;
                return;
            }
            // Validate Confirm Password
            if (errorMessage === '' && confirmPassword.length === 0) errorMessage = `Confirming new password is empty`;
            if (errorMessage === '' && confirmPassword.length < 12) errorMessage = `Passwords must be at least 12 characters`;
            if (errorMessage === '' && confirmPassword.length > 100) errorMessage = `Passwords cannot be longer than 100 characters`;
            if (errorMessage === '' && newPassword !== confirmPassword) errorMessage = `New password and confirmation of password does not match`;
            if (errorMessage !== '')
            {
                this.validation['passwordConfirmEdit'] = false;
                this.errorFeedback['passwordConfirmEdit'] = errorMessage;
                return;
            }

            const userid = this.userid;
            const apiUrl = `/jsonUpdateUserPassword`;
            const apiParams = {};
            apiParams['userid'] = userid;
            apiParams['current_password'] = currentPassword;
            apiParams['new_password'] = confirmPassword;
            const jsonUpdateUserPasswordOutput = await this.performPutHttpRequest(apiUrl, apiParams);
            if (jsonUpdateUserPasswordOutput['status'] != 'SUCCESS')
            {
                this.performShowErrorMessage(`Failed to update user's password. ${jsonUpdateUserPasswordOutput['message']}`);
                return;
            }

            this.closeChangePasswordModal();
            this.performShowSuccessMessage(`Your password was updated`);
        },
        async saveShippingAddress()
        {
            this.resetShippingAddressEditValidation();
            const street1 = this.shippingAddressEdit['street1'].trim();
            const street2 = this.shippingAddressEdit['street2'].trim();
            const city = this.shippingAddressEdit['city'].trim();
            const state = (this.shippingAddressEdit['state'] != null) ? this.shippingAddressEdit['state'].trim() : '';
            const zipCode = this.shippingAddressEdit['zipCode'].trim();
            const country = this.shippingAddressEdit['country'].trim();

            let errorMessage = '';
            // Validate Shipping Street1
            if (errorMessage === '' && street1.length === 0) errorMessage = `Street and number is empty`;
            if (errorMessage === '' && street1.length > 100) errorMessage = `Street and number cannot be longer than 100 characters`;
            if (errorMessage !== '')
            {
                this.validation['shippingEditStreet1'] = false;
                this.errorFeedback['shippingEditStreet1'] = errorMessage;
                return;
            }
            // Validate Shipping Street2
            if (errorMessage === '' && street2.length > 100) errorMessage = `Apartment, suite, building, etc. cannot be longer than 100 characters`;
            if (errorMessage !== '')
            {
                this.validation['shippingEditStreet2'] = false;
                this.errorFeedback['shippingEditStreet2'] = errorMessage;
                return;
            }
            // Validate Shipping City
            if (errorMessage === '' && city.length === 0) errorMessage = `City is empty`;
            if (errorMessage === '' && city.length > 50) errorMessage = `City cannot be longer than 50 characters`;
            if (errorMessage !== '')
            {
                this.validation['shippingEditCity'] = false;
                this.errorFeedback['shippingEditCity'] = errorMessage;
                return;
            }
            // Validate Shipping State
            if (errorMessage === '' && state.length === 0) errorMessage = `State is empty`;
            if (errorMessage === '' && state.length != 2) errorMessage = `State is invalid`;
            const stateRegex = /[A-Z]{2}/;
            if (errorMessage === '' && !stateRegex.test(state)) errorMessage = `State is invalid`;
            if (errorMessage !== '')
            {
                this.validation['shippingEditState'] = false;
                this.errorFeedback['shippingEditState'] = errorMessage;
                return;
            }
            // Validate Shipping Zip Code
            if (errorMessage === '' && zipCode.length === 0) errorMessage = `Zip Code is empty`;
            if (errorMessage === '' && zipCode.length != 5) errorMessage = `Zip Code is invalid`;
            const zipCodeRegex = /[0-9]{5}/;
            if (errorMessage === '' && !zipCodeRegex.test(zipCode)) errorMessage = `Zip Code is invalid`;
            if (errorMessage !== '')
            {
                this.validation['shippingEditZipCode'] = false;
                this.errorFeedback['shippingEditZipCode'] = errorMessage;
                return;
            }
            // Validate Shipping Country
            if (errorMessage === '' && country.length === 0) errorMessage = `Country is empty`;
            if (errorMessage === '' && country.length > 80) errorMessage = `Country cannot be longer than 80 characters`;
            if (errorMessage !== '')
            {
                this.validation['shippingEditCountry'] = false;
                this.errorFeedback['shippingEditCountry'] = errorMessage;
                return;
            }

            const userid = this.userid;
            const apiUrl = `/jsonUpdateUserShippingAddress`;
            const apiParams = {};
            apiParams['userid'] = userid;
            if (this.shippingAddress['street1'] != street1) apiParams['street1'] = street1;
            if (this.shippingAddress['street2'] != street2) apiParams['street2'] = street2;
            if (this.shippingAddress['city'] != city)       apiParams['city'] = city;
            if (this.shippingAddress['state'] != state)     apiParams['state'] = state;
            if (this.shippingAddress['zipCode'] != zipCode) apiParams['zipCode'] = zipCode;
            if (this.shippingAddress['country'] != country) apiParams['country'] = country;
            const jsonUpdateUserShippingAddressOutput = await this.performPutHttpRequest(apiUrl, apiParams);
            if (jsonUpdateUserShippingAddressOutput['status'] != 'SUCCESS')
            {
                this.performShowErrorMessage(`Failed to update user's shipping address. ${jsonUpdateUserShippingAddressOutput['message']}`);
                return;
            }

            this.shippingAddress['street1'] = street1;
            this.shippingAddress['street2'] = street2;
            this.shippingAddress['city'] = city;
            this.shippingAddress['state'] = state;
            this.shippingAddress['zipCode'] = zipCode;
            this.shippingAddress['country'] = country;
            this.closeEditShippingAddressModal();
            this.performShowSuccessMessage(`Your shipping address was updated`);
        },
        async saveBillingAddress()
        {
            this.resetBillingAddressEditValidation();
            const street1 = this.billingAddressEdit['street1'].trim();
            const street2 = this.billingAddressEdit['street2'].trim();
            const city = this.billingAddressEdit['city'].trim();
            const state = (this.billingAddressEdit['state'] != null) ? this.billingAddressEdit['state'].trim() : '';
            const zipCode = this.billingAddressEdit['zipCode'].trim();
            const country = this.billingAddressEdit['country'].trim();

            let errorMessage = '';
            // Validate Billing Street1
            if (errorMessage === '' && street1.length === 0) errorMessage = `Street and number is empty`;
            if (errorMessage === '' && street1.length > 100) errorMessage = `Street and number cannot be longer than 100 characters`;
            if (errorMessage !== '')
            {
                this.validation['billingStreet1'] = false;
                this.errorFeedback['billingStreet1'] = errorMessage;
                return;
            }
            // Validate Billing Street2
            if (errorMessage === '' && street2.length > 100) errorMessage = `Apartment, suite, building, etc. cannot be longer than 100 characters`;
            if (errorMessage !== '')
            {
                this.validation['billingStreet2'] = false;
                this.errorFeedback['billingStreet2'] = errorMessage;
                return;
            }
            // Validate Billing City
            if (errorMessage === '' && city.length === 0) errorMessage = `City is empty`;
            if (errorMessage === '' && city.length > 50) errorMessage = `City cannot be longer than 50 characters`;
            if (errorMessage !== '')
            {
                this.validation['billingCity'] = false;
                this.errorFeedback['billingCity'] = errorMessage;
                return;
            }
            // Validate Billing State
            if (errorMessage === '' && state.length === 0) errorMessage = `State is empty`;
            if (errorMessage === '' && state.length != 2) errorMessage = `State is invalid`;
            const stateRegex = /[A-Z]{2}/;
            if (errorMessage === '' && !stateRegex.test(state)) errorMessage = `State is invalid`;
            if (errorMessage !== '')
            {
                this.validation['billingState'] = false;
                this.errorFeedback['billingState'] = errorMessage;
                return;
            }
            // Validate Billing Zip Code
            if (errorMessage === '' && zipCode.length === 0) errorMessage = `Zip Code is empty`;
            if (errorMessage === '' && zipCode.length != 5) errorMessage = `Zip Code is invalid`;
            const zipCodeRegex = /[0-9]{5}/;
            if (errorMessage === '' && !zipCodeRegex.test(zipCode)) errorMessage = `Zip Code is invalid`;
            if (errorMessage !== '')
            {
                this.validation['billingZipCode'] = false;
                this.errorFeedback['billingZipCode'] = errorMessage;
                return;
            }
            // Validate Billing Country
            if (errorMessage === '' && country.length === 0) errorMessage = `Country is empty`;
            if (errorMessage === '' && country.length > 80) errorMessage = `Country cannot be longer than 80 characters`;
            if (errorMessage !== '')
            {
                this.validation['billingCountry'] = false;
                this.errorFeedback['billingCountry'] = errorMessage;
                return;
            }

            const userid = this.userid;
            const apiUrl = `/jsonUpdateUserBillingAddress`;
            const apiParams = {};
            apiParams['userid'] = userid;
            if (this.billingAddress['street1'] != street1) apiParams['street1'] = street1;
            if (this.billingAddress['street2'] != street2) apiParams['street2'] = street2;
            if (this.billingAddress['city'] != city)       apiParams['city'] = city;
            if (this.billingAddress['state'] != state)     apiParams['state'] = state;
            if (this.billingAddress['zipCode'] != zipCode) apiParams['zipCode'] = zipCode;
            if (this.billingAddress['country'] != country) apiParams['country'] = country;
            const jsonUpdateUserBillingAddressOutput = await this.performPutHttpRequest(apiUrl, apiParams);
            if (jsonUpdateUserBillingAddressOutput['status'] != 'SUCCESS')
            {
                this.performShowErrorMessage(`Failed to update user's billing address. ${jsonUpdateUserBillingAddressOutput['message']}`);
                return;
            }

            this.billingAddress['street1'] = street1;
            this.billingAddress['street2'] = street2;
            this.billingAddress['city'] = city;
            this.billingAddress['state'] = state;
            this.billingAddress['zipCode'] = zipCode;
            this.billingAddress['country'] = country;
            this.closeEditBillingAddressModal();
            this.performShowSuccessMessage(`Your billing address was updated`);
        },
        async saveCardPayment()
        {
            if (this.currentCreditCardIndex == null) return this.performShowErrorMessage(`Invalid selected card information`);

            this.resetEditCardPaymentValidation();
            const jsonCreditCardToEdit = this.creditCards[this.currentCreditCardIndex];
            if (!jsonCreditCardToEdit['uuid']) return this.performShowErrorMessage(`Invalid uuid`);
            const uuid = jsonCreditCardToEdit['uuid'];
            const expirationMonth = (this.creditCardEdit['expirationMonth'] != null) ? this.creditCardEdit['expirationMonth'].trim() : '';
            const expirationYear = this.creditCardEdit['expirationYear'].trim();

            let errorMessage = '';
            // Validate Card Expiration
            if (errorMessage === '' && expirationMonth.length === 0) errorMessage = `Expiration month is empty`;
            if (errorMessage === '' && expirationMonth.length != 2) errorMessage = `Expiration month must be 2 letters`;
            const cardExpirationMonthRegex = /(0[1-9]|1[0-2])/;
            if (errorMessage === '' && !cardExpirationMonthRegex.test(expirationMonth)) errorMessage = `Expiration month is invalid`;
            if (errorMessage !== '')
            {
                this.validation['cardExpirationMonthEdit'] = false;
                this.errorFeedback['cardExpirationMonthEdit'] = errorMessage;
                return;
            }
            if (errorMessage === '' && expirationYear.length === 0) errorMessage = `Expiration year is empty`;
            if (errorMessage === '' && expirationYear.length != 4) errorMessage = `Expiration year must be 4 numbers`;
            const cardExpirationYearRegex = /[0-9]{4}/;
            if (errorMessage === '' && !cardExpirationYearRegex.test(expirationYear)) errorMessage = `Expiration year is invalid`;
            if (errorMessage !== '')
            {
                this.validation['cardExpirationYearEdit'] = false;
                this.errorFeedback['cardExpirationYearEdit'] = errorMessage;
                return;
            }

            const userid = this.userid;
            const apiUrl = `/jsonEditUserCreditCardInformation`;
            const apiParams = {};
            apiParams['uuid'] = uuid;
            apiParams['userid'] = userid;
            // apiParams['cardholder_name'] = cardholderName;
            // apiParams['card_number'] = cardNumber;
            apiParams['expiration_month'] = expirationMonth;
            apiParams['expiration_year'] = expirationYear;
            apiParams['is_primary'] = false; // TODO
            const jsonEditUserCreditCardInfoOutput = await this.performPutHttpRequest(apiUrl, apiParams);
            if (jsonEditUserCreditCardInfoOutput['status'] != 'SUCCESS')
            {
                this.performShowErrorMessage(`Failed to edit credit card information. ${jsonEditUserCreditCardInfoOutput['message']}`);
                return;
            }

            this.closeEditCardPaymentModal();
            this.performShowSuccessMessage(`Your credit card information was updated`);
        },
        async addCardPayment()
        {
            this.resetAddCardPaymentValidation();
            const cardholderName = this.creditCardAdd['cardholderName'].trim();
            const cardNumber = this.creditCardAdd['cardNumber'].trim();
            const expirationMonth = (this.creditCardAdd['expirationMonth'] != null) ? this.creditCardAdd['expirationMonth'].trim() : '';
            const expirationYear = this.creditCardAdd['expirationYear'].trim();

            let errorMessage = '';
            // Validate Cardholder Name
            if (errorMessage === '' && cardholderName.length === 0) errorMessage = `Cardholder name is empty`;
            if (errorMessage === '' && cardholderName.length > 202) errorMessage = `Cardholder name cannot be longer than 202 characters`;
            if (errorMessage !== '')
            {
                this.validation['cardholderNameAdd'] = false;
                this.errorFeedback['cardholderNameAdd'] = errorMessage;
                return;
            }
            // Validate Card Number
            if (errorMessage === '' && cardNumber.length === 0) errorMessage = `Card number is empty`;
            if (errorMessage === '' && cardNumber.length !== 16) errorMessage = `Card number must be 16 numbers`;
            const cardNumberRegex = /[0-9]{16}/;
            if (errorMessage === '' && !cardNumberRegex.test(cardNumber)) errorMessage = `Card number is invalid`;
            if (errorMessage !== '')
            {
                this.validation['cardNumberAdd'] = false;
                this.errorFeedback['cardNumberAdd'] = errorMessage;
                return;
            }
            // Validate Card Expiration
            if (errorMessage === '' && expirationMonth.length === 0) errorMessage = `Expiration month is empty`;
            if (errorMessage === '' && expirationMonth.length != 2) errorMessage = `Expiration month must be 2 letters`;
            const cardExpirationMonthRegex = /(0[1-9]|1[0-2])/;
            if (errorMessage === '' && !cardExpirationMonthRegex.test(expirationMonth)) errorMessage = `Expiration month is invalid`;
            if (errorMessage !== '')
            {
                this.validation['cardExpirationMonthAdd'] = false;
                this.errorFeedback['cardExpirationMonthAdd'] = errorMessage;
                return;
            }
            if (errorMessage === '' && expirationYear.length === 0) errorMessage = `Expiration year is empty`;
            if (errorMessage === '' && expirationYear.length != 4) errorMessage = `Expiration year must be 4 numbers`;
            const cardExpirationYearRegex = /[0-9]{4}/;
            if (errorMessage === '' && !cardExpirationYearRegex.test(expirationYear)) errorMessage = `Expiration year is invalid`;
            if (errorMessage !== '')
            {
                this.validation['cardExpirationYearAdd'] = false;
                this.errorFeedback['cardExpirationYearAdd'] = errorMessage;
                return;
            }

            const userid = this.userid;
            const apiUrl = `/jsonAddUserCreditCardInformation`;
            const apiParams = {};
            apiParams['userid'] = userid;
            apiParams['cardholder_name'] = cardholderName;
            apiParams['card_number'] = cardNumber;
            apiParams['expiration_month'] = expirationMonth;
            apiParams['expiration_year'] = expirationYear;
            apiParams['is_primary'] = false; // TODO
            const jsonAddUserCreditCardInfoOutput = await this.performPutHttpRequest(apiUrl, apiParams);
            if (jsonAddUserCreditCardInfoOutput['status'] != 'SUCCESS')
            {
                this.performShowErrorMessage(`Failed to add credit card information. ${jsonAddUserCreditCardInfoOutput['message']}`);
                return;
            }

            this.closeAddCardPaymentModal();
            this.performShowSuccessMessage(`Your credit card information was added`);
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
        resetEmailEdit()
        {
            this.emailEdit = '';
        },
        resetEmailEditValidation()
        {
            this.validation['emailEdit'] = null;
            this.errorFeedback['emailEdit'] = '';
        },
        resetPhoneEdit()
        {
            this.phoneEdit = '';
        },
        resetPhoneEditValidation()
        {
            this.validation['phoneEdit'] = null;
            this.errorFeedback['phoneEdit'] = '';
        },
        resetDobEdit()
        {
            this.dobEdit = '';
        },
        resetDobEditValidation()
        {
            this.validation['dobEdit'] = null;
            this.errorFeedback['dobEdit'] = '';
        },
        resetPasswordEdit()
        {
            this.passwordCurrentEdit = '';
            this.passwordNewEdit = '';
            this.passwordConfirmEdit = '';
        },
        resetPasswordEditValidation()
        {
            this.validation['passwordCurrentEdit'] = null;
            this.validation['passwordNewEdit'] = null;
            this.validation['passwordConfirmEdit'] = null;
            this.errorFeedback['passwordCurrentEdit'] = '';
            this.errorFeedback['passwordNewEdit'] = '';
            this.errorFeedback['passwordConfirmEdit'] = '';
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
        resetShippingAddressEditValidation()
        {
            this.validation['shippingEditStreet1'] = null;
            this.validation['shippingEditStreet2'] = null;
            this.validation['shippingEditCity'] = null;
            this.validation['shippingEditState'] = null;
            this.validation['shippingEditZipCode'] = null;
            this.validation['shippingEditCountry'] = null;
            this.errorFeedback['shippingEditStreet1'] = '';
            this.errorFeedback['shippingEditStreet2'] = '';
            this.errorFeedback['shippingEditCity'] = '';
            this.errorFeedback['shippingEditState'] = '';
            this.errorFeedback['shippingEditZipCode'] = '';
            this.errorFeedback['shippingEditCountry'] = '';
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
        resetBillingAddressEditValidation()
        {
            this.validation['billingEditStreet1'] = null;
            this.validation['billingEditStreet2'] = null;
            this.validation['billingEditCity'] = null;
            this.validation['billingEditState'] = null;
            this.validation['billingEditZipCode'] = null;
            this.validation['billingEditCountry'] = null;
            this.errorFeedback['billingEditStreet1'] = '';
            this.errorFeedback['billingEditStreet2'] = '';
            this.errorFeedback['billingEditCity'] = '';
            this.errorFeedback['billingEditState'] = '';
            this.errorFeedback['billingEditZipCode'] = '';
            this.errorFeedback['billingEditCountry'] = '';
        },
        resetEditCardPayment()
        {
            this.creditCardEdit['expirationMonth'] = '';
            this.creditCardEdit['expirationYear'] = '';
            this.creditCardEdit['isPrimary'] = false;
            this.currentCreditCardIndex = null;
        },
        resetEditCardPaymentValidation()
        {
            this.validation['cardExpirationMonthEdit'] = null;
            this.validation['cardExpirationYearEdit'] = null;
            this.errorFeedback['cardExpirationMonthEdit'] = '';
            this.errorFeedback['cardExpirationYearEdit'] = '';
        },
        resetAddCardPayment()
        {
            this.creditCardAdd['cardNetwork'] = '';
            this.creditCardAdd['cardholderName'] = '';
            this.creditCardAdd['cardNumber'] = '';
            this.creditCardAdd['expirationMonth'] = '';
            this.creditCardAdd['expirationYear'] = '';
            this.creditCardAdd['isPrimary'] = false;
        },
        resetAddCardPaymentValidation()
        {
            this.validation['cardholderNameAdd'] = null;
            this.validation['cardNumberAdd'] = null;
            this.validation['cardExpirationMonthAdd'] = null;
            this.validation['cardExpirationYearAdd'] = null;
            this.errorFeedback['cardholderNameAdd'] = '';
            this.errorFeedback['cardNumberAdd'] = '';
            this.errorFeedback['cardExpirationMonthAdd'] = '';
            this.errorFeedback['cardExpirationYearAdd'] = '';
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
