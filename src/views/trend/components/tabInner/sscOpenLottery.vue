<script>
import Loading from '@/components/public/Loading.vue';
export default {
    name: 'winningNumbers'
};
</script>
<script setup>
import { issueDisplay } from '@/util/tools';
import { computed } from 'vue';

const titlesArray = ['第一球', '第二球', '第三球', '第四球', '第五球'];
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
                            {{ title }}
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody class="tableBody">
                <tr class="bodyItem" v-for="{ lotteryNum, results } in resultHistory" :key="lotteryNum">
                    <td class="text-[#63666F]">{{ issueDisplay(lotteryNum) }}</td>
                    <td v-for="(number, index) in results" :key="lotteryNum + number + index">
                        {{ number }}
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
            font-size: 12px !important;

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
    }
}
</style>
