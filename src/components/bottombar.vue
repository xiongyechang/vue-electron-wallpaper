<template>
	<div id="bottombar" ref="bottombar">
        <div class="opts">
            <span class="opt" title='关于' @click="gotoAbout">
				<i class="iconfont icon-about"></i>
			</span>
		</div>
		<div class="opts">
            <update></update>
            <span class="opt" title='电量'>
				<i class="iconfont" :class="[icon]"></i>
                <span class="iconfont-title">{{ number }}%</span>
			</span>
			<span class="opt" title='网络'>
				<i class="iconfont" :class="[network]"></i>
			</span>
		</div>
	</div>
</template>

<script>
  import { ref, onMounted, toRefs } from 'vue';
  import { useRouter } from 'vue-router';
  import update from '@/components/update';
  import { NETWORK, BATTERY } from '@/constants/constants';
	export default {
        name: "bottombar",
        components: { update },
        setup() {

            const network = ref(NETWORK.WIFI_ONLINE);
            
            const battery = {
                icon: BATTERY.FULL,
                number: 100
            };

            const router = useRouter();

            onMounted(() => {
                detectNetwork();
                timewait();
            });

            const timewait = () => {
                const timer = null;
                detectBattery();
                setTimeout(() => {
                    clearTimeout(timer);
                    timewait();
                }, 1000 * 60);
            }

            const setNetwork = () => {
                const connection = window.navigator.connection;
                const { effectiveType } = connection;
                if (effectiveType === '4g') {
                    network.value = NETWORK.NET_ONLINE
                } else if (effectiveType === 'wifi') {
                    network.value = NETWORK.WIFI_ONLINE
                }
            }

            const detectNetwork = () => {
                setNetwork()

                window.addEventListener(NETWORK.OFFLINE, () => {
                    network.value = NETWORK.WIFI_OFFLINE
                });

                window.addEventListener(NETWORK.ONLINE, () => {
                    setNetwork()
                    network.value = NETWORK.WIFI_ONLINE
                });
            }

            const detectBattery = () => {
                const _battery = window.navigator.getBattery();
                _battery.then(({ level }) => {
                    if (level >= 0.95) {
                        battery.icon = BATTERY.FULL;
                    } else if (level <= 0.20) {
                        battery.icon = BATTERY.EMPTY;
                    } else {
                        battery.icon = BATTERY.CHARGING;
                    }
                    battery.number = (level * 100).toFixed(0);
                })
            }

            const gotoAbout = () => {
                router.push({
                    name: 'about'
                })
            }

            return {
                network,
                ...toRefs(battery),
                timewait,
                setNetwork,
                detectNetwork,
                detectBattery,
                gotoAbout,
            }
        }
	};
</script>

<style lang="scss" scoped>
#bottombar {
    height: 33px;
    background: var(--primary-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    -webkit-app-region: drag;
    .opts {
        height: 33px;
        width: 100%;
        display: flex;
        align-items: center;

        &:first-child{
            justify-content: flex-start;
        }
        
        &:last-child{
            justify-content: flex-end;
        }
        .opt {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 33px;
            line-height: 33px;
            padding: 0 10px;
            text-align: center;
            color: #fff;
            -webkit-app-region: no-drag;
        }
    }

    .opt-hover {
        cursor: pointer;
        &:hover {
            background: red;
        }
    }
    .iconfont-title {
        font-size: 12px;
    }
}
</style>
