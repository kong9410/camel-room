#include <algorithm>
#include <cmath>
#include <iostream>
#include <utility>
#include <vector>
using namespace std;
int num_sim_user_topk;
int num_item_rec_topk;
int num_users;
int num_items;
int num_rows;
int num_reco_users;
vector<pair<double, int> > U;
vector<vector<double> > data_table(21001, vector<double>(71, 0));
double getavg(int x) {
  double result = 0;
  int count = 0;
  for (int i = 1; i <= 70; i++) {
    if (data_table[x][i] != 0) {
      result += data_table[x][i];
      count++;
    }
  }
  result /= count;
  return result;
}
double Pearson(int x, int y) {
  double result = 0;
  double avg_x = getavg(x);
  double avg_y = getavg(y);
  double result_top = 0;
  double result_bottom_left = 0;
  double result_bottom_right = 0;
  for (int i = 1; i <= 70; i++) {
    if (data_table[x][i] == 0 || data_table[y][i] == 0) {
      continue;
    }
    double IX = data_table[x][i] - avg_x;
    double IY = data_table[y][i] - avg_y;
    result_top += IX * IY;
    result_bottom_left += IX * IX;
    result_bottom_right += IY * IY;
  }
  result += result_top;
  double result_bottom = sqrt(result_bottom_left) * sqrt(result_bottom_right);
  result /= result_bottom;
  if (isnan(result)) {
    return 0;
  }
  return result;
}
double get_rating(int u, int i) {
  double result = 0;
  vector<pair<double, int> >::iterator it3;
  double k_right = 0;
  double result_right = 0;
  for (it3 = U.begin(); it3 != U.end(); it3++) {
    int u_prime = it3->second;
    double pearson = Pearson(u, u_prime);
    if (data_table[u_prime][i] == 0) {
      continue;
    }
    k_right += abs(pearson);
    result_right += pearson * (data_table[u_prime][i] - getavg(u_prime));
  }
  double k = 1 / k_right;
  result = getavg(u) + k * result_right;
  if (isnan(result)) {
    return 0;
  }
  return result;
}
void get_result(int reco_user) {
  vector<pair<double, int> > sim_users;
  for (int i = 1; i <= 300; i++) {
    if (i == reco_user) {
      continue;
    }
    double pearson = Pearson(reco_user, i);
    if (pearson == 0) {
      continue;
    }
    sim_users.push_back(make_pair(pearson, i));
  }
  sort(sim_users.begin(), sim_users.end(), greater<pair<double, int> >());
  U.clear();

  vector<pair<double, int> >::iterator it1;
  int count = 0;
  for (it1 = sim_users.begin(); it1 != sim_users.end(); it1++) {
    if (count == num_sim_user_topk) {
      break;
    }
    U.push_back(*it1);
    count++;
  }
  vector<pair<double, int> > ratings;
  ratings.clear();
  for (int i = 1; i <= 70; i++) {
    if (data_table[reco_user][i]) {
      continue;
    }
    double fresh_rating = get_rating(reco_user, i);
    // cout << i << " " << fresh_rating << endl;
    ratings.push_back(make_pair(fresh_rating, i));
  }
  sort(ratings.begin(), ratings.end(), greater<pair<double, int> >());
  count = 0;
  for (it1 = ratings.begin(); it1 != ratings.end(); it1++) {
/*    if (count == num_item_rec_topk) {
      break;
    }*/
    cout << it1->first << " " <<it1->second << " ";
    count++;
  }
  cout << endl;
}

int main(void) {

  scanf("%d", &num_sim_user_topk);
  scanf("%d", &num_item_rec_topk);
  scanf("%d", &num_users);
  scanf("%d", &num_items);
  scanf("%d", &num_rows);
  for (int i = 0; i < num_rows; i++) {
    int user_id;
    int item_id;
    double rating;
    scanf("%d %d %lf", &user_id, &item_id, &rating);
    data_table[user_id][item_id] = rating;
  }
  scanf("%d", &num_reco_users);
  for (int i = 0; i < num_reco_users; i++) {
    int reco_user;
    scanf("%d", &reco_user);
    get_result(reco_user);
  }
  return 0;
}
