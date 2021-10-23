<template>
    <div class="rules">
        <p class="drop-down" v-if="dropDown">释放立即刷新...</p>
        <div class="bscroll" ref="bscroll">
            <div class="bscroll-container">
                <ul>
                   <li>1</li>
                   <li>2</li>
                   <li>3</li>
                   <li>4</li>
                   <li>5</li>
                   <li>6</li>
                   <li>7</li>
                   <li>8</li>
                   <li>9</li>
                   <li>10</li>
                   <li>11</li>
                   <li>12</li>
                   <li>13</li>
                   <li>14</li>
                   <li>15</li>
                   <li>16</li>
                   <li>17</li>
                   <li>18</li>
                   <li>19</li>
                   <li>20</li>
                   <li>21</li>
                   <li>22</li>
                   <li>23</li>
                   <li>24</li>
                   <li>25</li>
                   <li>26</li>
                   <li>27</li>
                   <li>28</li>
                   <li>29</li>
                   <li>30</li>
                   <li>31</li>
                   <li>32</li>
                   <li>33</li>
                   <li>34</li>
                   <li>35</li>
                   <li>36</li>
                   <li>37</li>
                   <li>38</li>
                   <li>39</li>
                   <li>40</li>
                   <li>41</li>
                   <li>42</li>
                   <li>43</li>
                   <li>44</li>
                   <li>45</li>
                   <li>46</li>
                   <li>47</li>
                   <li>48</li>
                   <li>49</li>
                   <li>50</li>
                   <li>51</li>
                   <li>52</li>
                   <li>53</li>
                   <li>54</li>
                   <li>55</li>
                   <li>56</li>
                   <li>57</li>
                </ul>
            </div>
        </div>
        <p class="x">加载更多...</p>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
    data(){
        return{
            dropDown:false
        }
    },
    mounted(){
        this.scrollFn()
    },
    methods:{
        scrollFn(){
            this.$nextTick(() => {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.bscroll, {
                        click: true,
                        scrollY: true,
                        probeType: 3
                    });
                }else{
                    this.scroll.refresh();
                }
                this.scroll.on('scroll', (pos) => {
                    // console.log(pos.y,this.dropDown)
                    //如果下拉超过50px 就显示下拉刷新的文字
                    if(pos.y>50){
                        this.dropDown = true
                    }else{
                        this.dropDown = false
                    }
                })
                //touchEnd（手指离开以后触发） 通过这个方法来监听下拉刷新
                this.scroll.on('touchEnd', (pos) => {
                    // 下拉动作
                    if(pos.y > 50){
                        console.log("下拉刷新成功")
                        this.dropDown = false
                    }
                    //上拉加载 总高度>下拉的高度+10 触发加载更多
                    if(this.scroll.maxScrollY>pos.y+10){
                        console.log("加载更多")
                        //使用refresh 方法 来更新scroll  解决无法滚动的问题
                        this.scroll.refresh()
                    }
                    // console.log(this.scroll.maxScrollY+"总距离----下拉的距离"+pos.y)
                })
                console.log(this.scroll.maxScrollY)
            });
        }
    }
}
</script>


<style scoped>
.bscroll{
    width: 100%;
    height:500px;
    overflow: hidden;
}
.bscroll-container{
    border: 1px solid gray
}
li{
    list-style: none;
    line-height: 25px;
}
.drop-down{
    position: absolute;
    top:0px;
    lefT:0px;
    width: 100%;
    height: 50px;
    line-height:50px;
    text-align: center;
    font-size:0.8rem;
    color:#CCC;
}
</style>