<template>
    <b-container fluid>
        <h2>Write a review</h2>
        <input
            id="titleTextBox"
            v-model="title"
            placeholder="Title..."
            class="form-control form-control-md"
        >
        <b-form-textarea
            id="reviewTextBox"
            v-model="review"
            placeholder="Write a review..."
            rows="4"
            max-rows="10"
        >
        </b-form-textarea>
        <span 
            v-if="showError"
            style="color:red">
            {{ errorMessage }}
        </span>
        <span 
            v-if="showSuccess"
            style="color:green">
            {{ successMessage }}
        </span>
        <div class="mb-3">
            <input class="btn btn-outline-dark" type="button" id="imgUploadBtn" value="Upload Image" onclick="document.getElementById('imgUpload').click();" />
            <input class="form-control-sm" type="file" id="imgUpload" accept="image/*" style="display:none" @change="fileImages()" multiple>
        </div>
        <b-row class="mb-3" cols="12">
            <div v-for="item in imgArray" :key="item">
                <b-col cols="1">
                    <img :src="item" width="100" height="100" style="padding-left:1px" :id="item">
                    <b-button style="text-align:center;" size="sm" variant="danger" @click="removeImage(item)">Remove</b-button>
                </b-col>
            </div>
        </b-row>
        <br>
        <b-row class="float-right">
            <b-button
                variant="secondary"
                @click="resetReviews()"
            >
                Clear
            </b-button>
            <b-button
                variant="primary"
                @click="submitReview()"
            >
                Submit
            </b-button>
        </b-row>
    </b-container>
</template>

<script>
export default {
    data() {
        return {
            review : '',
            title : '',
            showError : false,
            errorMessage : '',
            showSuccess : false,
            successMessage : '',
            imgArray : [],
        }
    },
    props :
    {
        productid : String,
        userid : String,
    },
    async mounted() 
    {  
        this.reviewsArray = await this.fetchReviews();
    },
    methods :
    {
        async submitReview()
        {
            this.errorMessage = '';
            this.showError = false;
            console.log(`Inserting review for ${this.productid}`);
            const params = {};
            params['productid'] = this.productid;
            params['userid'] = this.userid;
            params['title'] = this.title;
            params['text'] = this.review;
            params['images'] = this.imgArray;
            const apiUrl = `/jsonSubmitReviews`;
            const jsonSubmitOutput = await this.performPostHttpRequest(apiUrl, params);
            console.log(jsonSubmitOutput);
            if (jsonSubmitOutput['status'] != 'SUCCESS')
            {
                this.errorMessage = `Unable to submit review. Please try again later.`;
                this.showError = true;
                return;
            }
            this.successMessage = `Successfully submitted!`;
            this.showSuccess = true;
            this.title = '';
            this.review = '';
            return jsonSubmitOutput.status;
        },
        async resetReviews()
        {
            this.title = '';
            this.review = '';
            this.errorMessage = '';
            this.showError = false;
            this.successMessage = '';
            this.showSuccess = false;
        },
        async fileImages()
        {
            let files = document.getElementById("imgUpload").files;
            for(let i = 0; i < files.length; i++)
            {
                this.imgArray.push(await this.toBase64(files[i]));
            }
        },
        async toBase64(file)
        {
            const image = new Image();
            const canvas = document.createElement('canvas');
            const max_size = 200;
            image.src = URL.createObjectURL(file);
            await image.decode();
            let width = image.width;
            let height = image.height;
            if (width > height) 
            {
                if (width > max_size) 
                {
                    height *= max_size / width;
                    width = max_size;
                }
            } 
            else 
            {
                if (height > max_size) 
                {
                    width *= max_size / height;
                    height = max_size;
                }
            }
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(image, 0, 0, width, height);
            const resizedImage = await new Promise(rs => canvas.toBlob(rs, 'image/png', 1));

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(resizedImage);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        },
        removeImage(item)
        {
            let index = this.imgArray.indexOf(item);
            this.imgArray.splice(index, 1);
        }
    },
    computed : 
    {
    }
}

</script>