<template>
    <div>
        <product-info
            :productObject="productSpecs"
            :productImage="productImg"
        >
        </product-info>
        <br>
        <review-display
            :productid="productid"
            :userid="userid"
        >
        </review-display>
        <write-review
            v-if="noCurrentReview"
            :productid="productid"
            :userid="userid"
        >
        </write-review>
        <user-review
            v-if="!noCurrentReview"
            :productid="productid"
            :userid="userid"
            @show-write-review="showWriteReview"
        >
        </user-review>
    </div>
</template>

<script>
import ReviewDisplay from '../components/ReviewDisplay.vue';
import WriteReview from '../components/WriteReview.vue';
import UserReview from '../components/UserReview.vue';
import ProductInfo from '../components/ProductInfo.vue';

export default {
    components : {
        ReviewDisplay,
        WriteReview,
        UserReview,
        ProductInfo,
    },
    data() {
        return {
            productid : 'P-197',
            userid : 'USR00001',
            noCurrentReview: false,
            productSpecs : {
                productid : 'P-197',
                product_name: 'AMD MI100,300W PCIe, 32GB Passive, Double Wide, GPU Customer Install',
                price: 9819.14,
                description: 'The era of exascale is here. Immense computational power coupled with the fusion of HPC and AI is enabling researchers to tackle grand challenges once thought beyond reach.',
                inventory: 10,
                manufacturer: 'AMD',
                model: 'MI100',
                memory_size: '32GB',
                memory_type: 'Passive',
                chip_manufacturer: 'Advanced Micro Devices',
            },
            productImg : 'tempimg.jpg',
        }
    },
    created() 
    {
    },
    methods:
    {
        showWriteReview()
        {
            this.noCurrentReview = true;
        },
    }
}

</script>