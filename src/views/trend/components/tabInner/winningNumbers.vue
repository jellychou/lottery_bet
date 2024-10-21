<script>
import Loading from '@/components/public/Loading.vue';
export default {
    name: 'winningNumbers'
};
</script>
<script setup>
import { issueDisplay } from '@/util/tools';
import { computed } from 'vue';
import One from '../img/one.svg';
import Two from '../img/two.svg';
import Three from '../img/three.svg';
import Four from '../img/four.svg';
import Five from '../img/five.svg';
import Six from '../img/six.svg';
import Seven from '../img/seven.svg';
import Eight from '../img/eight.svg';
import Nine from '../img/nine.svg';
import Ten from '../img/ten.svg';

const winNumberMap = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    10: 'ten'
};

const numberIcons = {
    1: One,
    2: Two,
    3: Three,
    4: Four,
    5: Five,
    6: Six,
    7: Seven,
    8: Eight,
    9: Nine,
    10: Ten
};
const titlesArray = ['冠军', '亚军', '第三', '第四', '第五', '第六', '第七', '第八', '第九', '第十'];
const { resultHistory } = defineProps({
    resultHistory: {
        type: Object,
        require: true
    },
    loading: {
        type: Boolean,
        require: true
    }
});
</script>

<template>
    <div class="tableLayout">
        <Loading v-if="loading" />
        <table v-else class="table">
            <thead>
                <tr class="header">
                    <th class="headerItem firstHeaderItem">期号</th>
                    <th class="headerItem" v-for="title in titlesArray" :key="title">
                        <div class="verticalTitle">
                            <span>{{ title[0] }}</span>
                            <span>{{ title[1] }}</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody class="tableBody">
                <tr class="bodyItem" v-for="{ lotteryNum, results } in resultHistory" :key="lotteryNum">
                    <td class="text-[#63666F] text-sm">{{ issueDisplay(lotteryNum) }}</td>
                    <td v-for="(number, index) in results" :key="lotteryNum + number + index">
                        <div :class="[{ [winNumberMap[number]]: true }, 'numberBox', 'flex', 'justify-center', 'items-center']">
                            <component class="numberImg" :is="numberIcons[number]" />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss">
.tableLayout {
    height: calc(100dvh - 218px);
    overflow-y: scroll;
}
.table {
    width: 100%;
    border-collapse: collapse;

    .header {
        th {
            border-left: 0.5px solid #98989a;
            background-color: #f5f5f5;
            text-align: center;
            padding: 4px;
            font-size: 12px;
            color: #63666f;

            &:first-child {
                width: 68px;
                border-left: none;
            }

            .verticalTitle {
                display: flex;
                flex-direction: column;
            }
        }
    }
}
.tableBody {
    max-height: calc(100dvh - 280px);
    overflow-y: auto;

    .bodyItem {
        &:nth-child(even) {
            background-color: #f5f5f5;
        }

        &:last-child {
            border-bottom: 0.5px solid #0000001a;
        }

        td {
            text-align: center;
            color: #63666f;
            padding: 4px;
            border-left: 0.5px solid #98989a;

            &:first-child {
                width: 68px;
                border-left: none;
            }
        }

        .numberBox {
            border-radius: 2px;
            width: 20px;
            height: 20px;
            margin: 0 auto;

            .numberImg {
                width: 70%;
                height: 70%;
            }
        }

        .one {
            background-color: #ffe040;
        }
        .two {
            background-color: #40a1fb;
        }
        .three {
            background-color: #434343;
        }
        .four {
            background-color: #ff7539;
        }
        .five {
            background-color: #11dcdc;
        }
        .six {
            background-color: #5464fb;
        }
        .seven {
            background-color: #bebebe;
        }
        .eight {
            background-color: #fe4141;
        }
        .nine {
            background-color: #703b2a;
        }
        .ten {
            background-color: #41c05d;
        }
    }
}
</style>
