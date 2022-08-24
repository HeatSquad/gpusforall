<template>
    <b-container fluid>
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
        <br>
        <b>Current Images</b>
        <b-row class="mb-3" cols="12">
            <div v-for="item in imgArray" :key="item.imageid">
                <b-col cols="1">
                    <img :src="item.image" width="100" height="100" style="padding-left:1px" :id="item.imageid">
                    <b-button style="text-align:center;" size="sm" variant="danger" @click="removeImage(item)">Remove</b-button>
                </b-col>
            </div>
        </b-row>
        <br>
        <b>New Images</b>
        <div class="mb-3">
            <input class="btn btn-outline-dark" type="button" id="imgUploadBtn" value="Upload Image" onclick="document.getElementById('imgUpload').click();" />
            <input class="form-control-sm" type="file" id="imgUpload" accept="image/*" style="display:none" @change="fileImages()" multiple>
        </div>
        <b-row class="mb-3" cols="12">
            <div v-for="item in newImgArray" :key="item">
                <b-col cols="1">
                    <img :src="item" width="100" height="100" style="padding-left:1px" :id="item">
                    <b-button style="text-align:center;" size="sm" variant="danger" @click="removeNewImage(item)">Remove</b-button>
                </b-col>
            </div>
        </b-row>
        <br>
        <b-row class="float-right">
            <b-button
                variant="secondary"
                @click="$emit('close')"
            >
                Cancel
            </b-button>
            <b-button
                variant="primary"
                @click="submitEditedReview()"
            >
                Save
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
            newImgArray : [],
        }
    },
    props :
    {
        reviewData : Object,
    },
    async mounted() 
    {  
        this.title = this.reviewData.title;
        this.review = this.reviewData.text;
        this.imgArray = this.reviewData.imgArray;
        console.log(this.reviewData);
    },
    methods :
    {
        //redo
        async submitEditedReview()
        {
            this.errorMessage = '';
            this.showError = false;
            console.log(`Editing review for ${this.reviewData.productid}`);
            const params = {};
            params['productid'] = this.reviewData.productid;
            params['reviewid'] = this.reviewData.reviewid;
            params['userid'] = this.reviewData.userid;
            params['title'] = this.title;
            params['text'] = this.review;
            params['images'] = this.imgArray;
            params['newimages'] = this.newImgArray;
            const apiUrl = `/services/jsonEditReviews`;
            const jsonSubmitOutput = await this.performPutHttpRequest(apiUrl, params);
            console.log(jsonSubmitOutput);
            if (jsonSubmitOutput['status'] != 'SUCCESS')
            {
                this.errorMessage = `Unable to edit review. Please try again later.`;
                this.showError = true;
                return;
            }
            this.successMessage = `Successfully edited!`;
            this.showSuccess = true;
            this.$emit('success');
        },
        async fileImages()
        {
            let files = document.getElementById("imgUpload").files;
            for(let i = 0; i < files.length; i++)
            {
                this.newImgArray.push(await this.toBase64(files[i]));
            }
            console.log(this.newImgArray);
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
        },
        removeNewImage(item)
        {
            let index = this.newImgArray.indexOf(item);
            this.newImgArray.splice(index, 1);
        }
    },
    computed : 
    {
    }
}

</script>