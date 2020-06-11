<div class="authenticated">
  <Feeds />
  <Feed />
  <Article />
</div>

<style>
  @import "library/functions";
  @import "library/mixins.scss";

  .authenticated {
    display: grid;
    grid-template-areas: "feeds feed article";
    grid-template-columns: 16rem 23rem minmax(0, 1fr);
    grid-template-rows: minmax(0, 100%);
    width: 100%;
  }
</style>

<script>
  import Feeds from 'components/feeds';
  import Feed from 'components/feed';
  import Article from 'components/article';
  import Settings from 'components/settings';
</script>
