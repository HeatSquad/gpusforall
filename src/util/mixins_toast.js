export default 
{
    methods: {
        performShowSuccessMessage(message, duration = 3)
        {
            const durationMilliseconds = duration * 1000;
            this.$bvToast.toast(message, {
                autoHideDelay: durationMilliseconds,
                appendToast: true,
                variant: 'success',
                noCloseButton: true,
                solid: true,
            });
        },
        performShowWarningMessage(message, duration = 3)
        {
            const durationMilliseconds = duration * 1000;
            this.$bvToast.toast(message, {
                autoHideDelay: durationMilliseconds,
                appendToast: true,
                variant: 'warning',
                noCloseButton: true,
                solid: true,
            });
        },
        performShowErrorMessage(message, duration = 3)
        {
            const durationMilliseconds = duration * 1000;
            this.$bvToast.toast(message, {
                autoHideDelay: durationMilliseconds,
                appendToast: true,
                variant: 'danger',
                noCloseButton: true,
                solid: true,
            });
        },
        performShowInfoMessage(message, duration = 3)
        {
            const durationMilliseconds = duration * 1000;
            this.$bvToast.toast(message, {
                autoHideDelay: durationMilliseconds,
                appendToast: true,
                variant: 'info',
                noCloseButton: true,
                solid: true,
            });
        },
    }
}